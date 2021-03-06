// Loccal storage helper

const LocalStorage = {};

LocalStorage.setLocation = (loc) => {
  console.log('[LocalStorage::setLocation] Updating cached location');
  const { lat, lon } = loc;
  localStorage.setItem('lat', lat);
  localStorage.setItem('lon', lon);
  return { lat, lon };
};

LocalStorage.getLocation = () => {
  const lat = localStorage.getItem('lat');
  const lon = localStorage.getItem('lon');
  return lat && lon ? { lat, lon } : false;
};

LocalStorage.isTNCAccepted = () =>
  localStorage.getItem('nevio-tnc') === 'true' ? true : false;

LocalStorage.acceptTNC = () => localStorage.setItem('nevio-tnc', true);

LocalStorage.setLocale = (locale) => {
  console.log(
    `[LocalStorage::setLocale] Updating language preferences to ${locale}`
  );
  localStorage.setItem('custom-lang', locale);
  return locale;
};

LocalStorage.getLocale = () => {
  const locale = localStorage.getItem('custom-lang');
  return locale ? locale : null;
};
