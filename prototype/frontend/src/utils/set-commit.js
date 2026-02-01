const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Commit-ID und Zeit holen
const commit = execSync('git rev-parse --short HEAD').toString().trim();
const timestamp = new Date().toISOString();

// Pfad zu public/static/commit.json
const filePath = path.join(__dirname, '../../public/static/commit.json');

// Ordner sicherstellen
const dir = path.dirname(filePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Datei schreiben
fs.writeFileSync(filePath, JSON.stringify({ commit, buildTime: timestamp }, null, 2));
console.log(`commit.json written with commit ${commit} at ${timestamp}`);
