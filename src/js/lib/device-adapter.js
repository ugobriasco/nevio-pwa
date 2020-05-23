const noSleep = new NoSleep();
const gAPI_URL = `https://www.googleapis.com/geolocation/v1/geolocate?key=${CFG.GOOGLE_API_KEY}`;

const DeviceAdapter = {};

// Determine the locale of the application in use
DeviceAdapter.getLocale = () => {
  if (window.navigator.languages) {
    return window.navigator.languages[0];
  } else {
    return window.navigator.userLanguage || window.navigator.language;
  }
};

// Get location from the borwser (requires consent)
DeviceAdapter.getLocation = () =>
  new Promise((resolve, reject) => {
    console.log('[DeviceAdapter::getLocation] Gathering data..');
    if (!navigator.geolocation) {
      const msg = 'Geolocation is not supported by your browser.';
      Alert.throwError(msg);
      reject('[DeviceAdapter::getLocation]' + msg);
    } else {
      // https://stackoverflow.com/questions/3397585/navigator-geolocation-getcurrentposition-sometimes-works-sometimes-doesnt
      navigator.geolocation.getCurrentPosition(
        onPositionFound,
        onPositionNotFound,
        { timeout: 5000 }
      );

      function onPositionFound(position) {
        console.log('[DeviceAdapter::getLocation] Device located');
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      }

      function onPositionNotFound() {
        console.log(
          '[DeviceAdapter::getLocation] Location API did not work, falling back to Google API'
        );
        return getLocationFromGoogle()
          .then(data => {
            resolve({ ...data });
          })
          .catch(err => {
            const msg =
              'It was not possible to locate the client device. Please refresh the page.';
            Alert.throwWarning(msg);
            Sentry.captureException(new Error(msg));
            reject('[DeviceAdapter::getLocation]' + msg);
          });
      }
    }
  });

// Control text to speach
DeviceAdapter.speechSynthesis = {
  play: plot => {
    const utterance = new SpeechSynthesisUtterance(plot);
    utterance.lang = locale;
    window.speechSynthesis.speak(utterance);
  },
  stop: () => window.speechSynthesis.cancel(),
  resume: () => window.speechSynthesis.resume(),
  pause: () => window.speechSynthesis.pause()
};

// Prevents screen of mobile devices to go in sleep, aborting speech speechSynthesis
DeviceAdapter.noSleep = {
  enable: () => noSleep.enable(),
  disable: () => noSleep.disable()
};

// Use Google Location API to eturn the position of the client device
const getLocationFromGoogle = () =>
  fetch(gAPI_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      const { lat, lng } = data.location;
      return { lat, lon: lng };
    });
