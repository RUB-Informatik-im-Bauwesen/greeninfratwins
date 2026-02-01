// server.js
const express = require('express');
const cors = require('cors');
const math = require('mathjs');
const morgan = require('morgan');
const crypto = require('crypto');

// Node >= 18 hat global fetch; für ältere Versionen:
let fetchFn = global.fetch || undefined;
if (!fetchFn) {
  fetchFn = require('node-fetch'); // npm i node-fetch
}

const app = express();
const port = process.env.PORT || 4000;

/* ----------------------------- Logging-Setup ----------------------------- */
/**
 * Ziel: Saubere Terminal-Logs mit:
 *  - standardisierten HTTP-Logs (morgan)
 *  - konsistenten Applikationslogs inkl. Request-ID (für Traceability)
 */

// Middleware: jedem Request eine ID geben (für Korrelation)
app.use((req, _res, next) => {
  req.id = crypto.randomUUID();
  next();
});

// morgan um eigene Tokens erweitern
morgan.token('id', (req) => req.id);
morgan.token('real-ip', (req) => {
  // dank app.set('trust proxy', true) kommt die echte IP aus x-forwarded-for
  return req.ip || req.connection?.remoteAddress || '';
});

// morgan-Format (Datum, ID, Methode, URL, Status, Dauer, Größe, IP, UA)
const httpLogFormat =
  ':date[iso] req=:id :method :url :status :res[content-length] - :response-time ms ip=":real-ip" ua=":user-agent"';

// HTTP-Request-Logging aktivieren
app.use(morgan(httpLogFormat));

/**
 * Kleine Logger-Helfer mit Leveln und Request-ID
 * (bewusst simpel gehalten; kein externes Logger-Framework nötig)
 */
function logInfo(msg, ctx = {}) {
  // ISO-Zeit + Level + optionale req.id
  const parts = [
    new Date().toISOString(),
    'INFO',
    ctx.reqId ? `(req=${ctx.reqId})` : '',
    msg,
    Object.keys(ctx.extra || {}).length ? JSON.stringify(ctx.extra) : '',
  ].filter(Boolean);
  console.log(parts.join(' '));
}

function logError(err, ctx = {}) {
  const parts = [
    new Date().toISOString(),
    'ERROR',
    ctx.reqId ? `(req=${ctx.reqId})` : '',
    err?.message || String(err),
  ].filter(Boolean);
  console.error(parts.join(' '));
  if (err && err.stack) {
    console.error(err.stack);
  }
}

/* ------------------------------- Middleware ------------------------------ */

// CORS nur für dein React (localhost:3000)
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
// Preflight explizit zulassen
app.options('*', cors(corsOptions));

app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* --------------------------------- Routen -------------------------------- */

app.get('/health', (req, res) => {
  logInfo('Health check', { reqId: req.id });
  res.send('OK');
});

// ---------- POST /calculate ----------
app.post('/calculate', (req, res) => {
  const start = Date.now();
  try {
    let { formula, values } = req.body;

    logInfo('Calculate request received', {
      reqId: req.id,
      extra: { formula, valuesType: typeof values },
    });

    if (!formula || typeof formula !== 'string') {
      return res
        .status(400)
        .json({ error: 'Invalid formula. It must be a non-empty string.' });
    }

    // Optional: Werte aus String JSON-parsen (falls Frontend sie als String sendet)
    if (typeof values === 'string') {
      try {
        values = JSON.parse(values);
      } catch {
        return res
          .status(400)
          .json({ error: 'Invalid JSON format for values.' });
      }
    }

    if (typeof values !== 'object' || values === null) {
      return res.status(400).json({ error: 'Values must be a valid object.' });
    }

    const result = evaluateFormula(formula, values);

    const durationMs = Date.now() - start;
    logInfo('Calculate result', {
      reqId: req.id,
      extra: { result, durationMs },
    });

    res.json({ result });
  } catch (err) {
    logError(err, { reqId: req.id });
    res.status(400).json({ error: err.message || 'Invalid formula.' });
  }
});

// ---------- GET /api/epd/:uuid (mit Timeout) ----------
app.get('/api/epd/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  const url = `https://oekobaudat.de/OEKOBAU.DAT/resource/processes/${uuid}?format=json`;

  // Timeout (z. B. 8 s)
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);

  const start = Date.now();
  logInfo('EPD fetch start', { reqId: req.id, extra: { uuid, url } });

  try {
    const response = await fetchFn(url, { signal: controller.signal });
    if (!response.ok) {
      const msg = `Failed to fetch: ${response.statusText}`;
      logError(new Error(msg), {
        reqId: req.id,
        extra: { status: response.status },
      });
      return res.status(response.status).json({ error: msg });
    }
    const data = await response.json();

    const durationMs = Date.now() - start;
    logInfo('EPD fetch success', {
      reqId: req.id,
      extra: { uuid, durationMs, bytes: JSON.stringify(data).length },
    });

    res.json(data);
  } catch (error) {
    const msg =
      error.name === 'AbortError'
        ? 'Upstream timeout'
        : 'Error fetching data from Oekobaudat';
    logError(error, { reqId: req.id });
    res.status(502).json({ error: msg });
  } finally {
    clearTimeout(t);
  }
});

// Nur lokal lauschen (kein Zugriff von außen)
app.listen(port, '127.0.0.1', () => {
  console.log(
    `${new Date().toISOString()} INFO Server listening at http://127.0.0.1:${port}`
  );
});

/* --------------------------- Formel-Helfer unten -------------------------- */
function evaluateFormula(formula, values = {}) {
  const scope = { ...values };
  const node = math.parse(formula);

  // Undefinierte Variablen explizit melden
  const undefinedSymbols = node.filter(
    (n) => n.isSymbolNode && !(n.name in scope)
  );
  if (undefinedSymbols.length > 0) {
    const names = undefinedSymbols.map((s) => s.name);
    throw new Error(`Undefined variables: ${names.join(', ')}`);
  }
  return node.evaluate(scope);
}

/* ----------------------- Prozessweite Fehler-Handler ---------------------- */
process.on('unhandledRejection', (reason) => {
  console.error(`${new Date().toISOString()} ERROR UnhandledRejection`, reason);
});
process.on('uncaughtException', (err) => {
  console.error(`${new Date().toISOString()} ERROR UncaughtException`, err);
  // optional: process.exit(1);
});
