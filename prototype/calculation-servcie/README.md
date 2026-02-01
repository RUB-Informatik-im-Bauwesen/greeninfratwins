# calculation-service

1. Install package.json with `npm install`

2. Start with `npm start`

3. Use following request (example)

```
curl --request POST \
  --url http://localhost:4000/calculate \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate, br' \
  --header 'Connection: keep-alive' \
  --header 'User-Agent: EchoapiRuntime/1.1.0' \
  --data 'formula=volume*epd*20' \
  --data 'values={"volume":1.05784,"epd":2.05673}'`
  ```