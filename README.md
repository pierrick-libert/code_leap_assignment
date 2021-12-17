# Code Leap Assignment


## Install all dependencies

```bash
npm install
```

## Launching locally

```bash
npm start
```

## Launch Functional Test

First launch the API locally
```bash
npm start
```
Finally, launch this command line to execute functional tests
```bash
npm test
```

## Check linting

```bash
npm run lint
```

## Technological stack

 * Nodejs 12.11 mininmum
 * Typescript (installed through npm)
 * Webpack (installed through npm)

## Environment variables

|Name|Type|Default value|Description|
|--|--|--|--|
|PG_USER|string|navwei|PostgreSQL username|
|PG_PASS|string|toto42|PostgreSQL password|
|PG_HOST|string|localhost|PostgreSQL host|
|PG_DB|string|Navwei|PostgreSQL DB|
|PG_PORT|string|5432|PostgreSQL PORT|
|SECRET_KEY|string||Secret key to generate the JWT|
|SENTRY_DSN|string||DSN from Sentry for the specific project|
|NODE_ENV|string|staging|Node environment to know if we're in prod or not|
|API_URL|string|http://127.0.0.1:8080 |Api URL|

### Contributor

|Name|Role|
|--|--|
|[Pierrick Libert](https://github.com/pierrick-libert)|_Admin_|
