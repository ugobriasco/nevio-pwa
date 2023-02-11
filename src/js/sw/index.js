const version = '1.5.7';
const staticCacheName = `nevio-static-v${version}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(staticCacheName)
      .then(function (cache) {
        console.log('[sw::onInstall] Installing cache');
        return cache.addAll([
          '/',
          './index.html',
          './story.html',
          './discover.html',
          './settings.html',
          './js/home.js',
          './js/story.js',
          './js/discover-stories.js',
          './js/settings.js',
          './css/style.css',
          './img/bg-sm.jpg',
          './manifest.json',
          'https://unpkg.com/leaflet@1.0.1/dist/leaflet.css',
          'https://unpkg.com/leaflet@1.0.1/dist/leaflet.js',
          'https://browser.sentry-cdn.com/5.15.5/bundle.min.js'
        ]);
      })
      .catch((err) => handleError('[sw::onInstall]' + err))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.filter(
            (cName) =>
              cName.startsWith('nevio-static-') && cName != staticCacheName
          )
        )
      )
      .then((cNames) => cNames.map((cName) => caches.delete(cName)))
      .catch((err) => handleError('[sw::onActivate]' + err))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request, { ignoreSearch: true })
      .then((res) => res || fetch(event.request))
      .catch((err) => handleError('sw::onFetch]' + err))
  );
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

const handleError = (title, err) => {
  console.log(title + err);
};
