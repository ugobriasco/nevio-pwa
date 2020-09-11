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
  Object.keys(TRANSLATIONS).map((key) => TRANSLATIONS[key].languageName);

//save prefereed language in the storage memory (default none)
Locale.set = (key) => {};

//get preferred language
Locale.get = () => {};

//apply localised text
Locale.applyTranslation = () => {};
