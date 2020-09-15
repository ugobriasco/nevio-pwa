document.addEventListener('DOMContentLoaded', (event) => {
  renderLanguageSelection();
});

const renderLanguageSelection = () => {
  const { locale, languageName } = getTranslations();

  const container = document.getElementById('language-selection');
  container.innerHTML = '';

  const box = document.createElement('div');
  box.id = 'sidenav-language-select';
  box.classList.add('custom-select');
  box.setAttribute('onClick', 'toggleDropDown()');
  box.innerHTML = `<div class="custom-select__trigger"><span id="txt-languageName">${languageName}</span>
      <div class="arrow"></div>
  </div>`;

  const select = document.createElement('div');
  select.classList.add('custom-options');
  select.id = 'custom-options';

  box.append(select);
  container.append(box);

  renderLanguageOptions(locale);
};

const renderLanguageOptions = (locale) => {
  const currentLocale = locale == 'null' ? null : locale;

  const select = document.getElementById('custom-options');
  select.innerHTML = '';

  const languageAvailable = [{ key: null, languageName: 'Default' }].concat(
    Locale.getAvailable()
  );

  languageAvailable.forEach((item, i) => {
    const span = document.createElement('span');
    span.classList.add('custom-option');
    span.id = `opt-${item.key}`;

    if (item.key == currentLocale) {
      span.classList.add('selected');
    }
    span.setAttribute('data-value', item.key);
    span.setAttribute('onClick', `selectLanguage('${item.key}')`);
    span.innerHTML = item.languageName;
    select.append(span);
  });
};

const getTranslations = () => {
  const locale = Locale.get();
  const translations = Locale.getTranslations(locale);
  const languageName =
    translations && translations.languageName
      ? translations.languageName
      : 'Default';
  return { locale, languageName };
};

const updateTranslations = () => {
  document.getElementById(
    'txt-languageName'
  ).innerHTML = getTranslations().languageName;
};

const selectLanguage = (locale) => {
  Locale.set(locale);
  updateTranslations();
  renderLanguageOptions(locale);
};

const toggleDropDown = () => {
  const select = document.getElementById('sidenav-language-select');
  if (select.classList.contains('open')) {
    select.classList.remove('open');
  } else {
    select.classList.add('open');
  }
};
