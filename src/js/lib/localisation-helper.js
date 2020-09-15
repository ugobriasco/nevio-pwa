// Handles localisation
const TRANSLATIONS = {
  'it-IT': {
    languageName: 'Italiano',
    closeBtn: 'Chiudi'
  },
  'de-DE': {
    languageName: 'Deutsch',
    closeBtn: 'Schliessen'
  }
};

const Locale = {};

//get available locale
Locale.getAvailable = () =>
  Object.keys(TRANSLATIONS).map((key) => {
    const { languageName } = TRANSLATIONS[key];
    return { key, languageName };
  });

Locale.getTranslations = (key) => {
  const translations = Locale.getAvailable().filter((item) => item.key == key);
  return translations == null ? false : translations[0];
};

//save prefereed language in the storage memory (default none)
Locale.set = (key) => {
  const selection = Object.keys(TRANSLATIONS).filter((k) => k == key);
  LocalStorage.setLocale(key);
};

//get preferred language
Locale.get = () => LocalStorage.getLocale();

//apply localised text
Locale.applyTranslation = () => {};
