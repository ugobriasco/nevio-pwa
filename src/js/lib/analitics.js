(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  (i[r] =
    i[r] ||
    function () {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-164642359-1', 'nevio.ml', {
  anonymizeIp: true,
  storage: 'none',
  clientId: window.localStorage.getItem('ga_clientId')
});
ga(function (tracker) {
  window.localStorage.setItem('ga_clientId', tracker.get('clientId'));
});
ga('send', 'pageview');

const Analitics = {};

Analitics.initSentry = () =>
  Sentry.init({
    dsn:
      'https://d9b20d9f542245458e561ae1f4d6c80d@o383378.ingest.sentry.io/5213500',
    release: `nevio-pwa@${sw.getVersion()}`
  });
