const sw = {};

sw.PATH = '/sw.js';
sw.version = '1.4.5';

sw.init = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(sw.PATH)
      .then(function (reg) {
        if (!navigator.serviceWorker) {
          return;
        }

        if (reg.installing) {
          console.log('[sw::init] Service worker installing');
          sw.trackState(reg.installing);
          return;
        }

        if (reg.waiting) {
          console.log('[sw::init] Service worker installed');
          sw.updateReady(reg.waiting);
          return;
        }

        if (reg.active) {
          console.log('[sw::init] Service worker active');
        }

        reg.addEventListener('updatefound', function () {
          sw.trackState(reg.installing);
        });
      })
      .catch(function (error) {
        // registration failed
        console.log('[sw::init] Registration failed with ' + error);
      });
  }
};

sw.update = (worker) => worker.postMessage({ action: 'skipWaiting' });

sw.trackState = (worker) => {
  worker.addEventListener('statechange', function () {
    if (worker.state == 'installed') {
      sw.updateReady(worker);
    }
  });
};

sw.updateReady = function (worker) {
  console.log('[sw::init] Updating...');
  // Here is a good place to change ask the user if the update shal be applied
  worker.postMessage({ action: 'skipWaiting' });

  return;
};

sw.renderVersion = function () {
  const container = document.getElementById('app-version');
  if (!container) {
    return;
  } else {
    container.innerHTML = `${sw.version}`;
  }
};

sw.getVersion = () => sw.version;
