# Nevio PWA

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A Progressive Web Application (PWA) in pure JS offering the web interface to Nevio Audioguide. It aims to push to the edge the capabilities of mobile browsers, using:

- IndexDB, service workers, LocalStorage, Cache etc etc..
- Native geolocation api with fallback to Google API
- Speech Synthesis API

## Getting Started

Install and configure:

```
  npm i
  cp config-local.js.template config-local.js
  cp config-prod.js.template config-prod.js
```

Start the application:

```
  npm start
```

## Developing

Use node v12.22.12 to compile this project.

### Generating PWA assets

```
npm i -g pwa-asset-generator
pwa-asset-generator ./img/logo.png ./img/icons -i ./index.html -m ./manifest.json --background "rgb(37, 40, 49)" --type png
```

### Application versioning

As the application is mostly cached by the service worker, please increase its version before deploying - otherwise the PWA will not be updated. This means changing the following files accrdingly:

```
  ./src/js/sw-handler.js
  ./src/sw/index.js
```

By changing the IDB, pleas change its version, maintaining backward-compatibility:

```
  ./src/js/lib/idb-helper.js
```

## Deploying

Configure the target machine by editing the related config file:

```
  cp .deployment/config.sh.template .deployment/config.sh
  vim .deployment/config.sh
```

Run the deployment job:

```
  npm run deploy
```
