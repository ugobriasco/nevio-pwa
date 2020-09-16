const Analitics = {};

Analitics.initSentry = () =>
  Sentry.init({
    dsn:
      'https://d9b20d9f542245458e561ae1f4d6c80d@o383378.ingest.sentry.io/5213500',
    release: `nevio-pwa@${sw.getVersion()}`
  });
