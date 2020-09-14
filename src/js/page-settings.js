document.addEventListener('DOMContentLoaded', (event) => {
  renderLanguageSelection();
});

const renderLanguageSelection = () => {
  const languageAvailable = ['Default'].concat(Locale.getAvailable());
  console.log(languageAvailable);

  const container = document.getElementById('language-selection');
  console.log(container);

  const h2 = document.createElement('h2');
  h2.innerHTML = 'Language';
  container.append(h2);

  /*
  <div id="sidenav-language-select" class="custom-select" onClick="SideNav.toggleDropDown()">
      <div class="custom-select__trigger"><span>Tesla</span>
          <div class="arrow"></div>
      </div>
      <div class="custom-options" >
          <span class="custom-option selected" data-value="tesla">Tesla</span>
          <span class="custom-option" data-value="volvo">Volvo</span>
          <span class="custom-option" data-value="mercedes">Mercedes</span>
      </div>
  </div>

  */

  const box = document.createElement('div');
  box.id = 'sidenav-language-select';
  box.classList.add('custom-select');
  box.setAttribute('onClick', 'toggleDropDown()');
  box.innerHTML = `<div class="custom-select__trigger"><span>${languageAvailable[0]}</span>
      <div class="arrow"></div>
  </div>`;

  const select = document.createElement('div');
  select.classList.add('custom-options');
  languageAvailable.forEach((language, i) => {
    const span = document.createElement('span');
    span.classList.add('custom-option');
    span.setAttribute('data-value', language);
    span.innerHTML = language;
    select.append(span);
  });

  box.append(select);
  container.append(box);
};

const toggleDropDown = () => {
  const select = document.getElementById('sidenav-language-select');
  if (select.classList.contains('open')) {
    select.classList.remove('open');
  } else {
    select.classList.add('open');
  }
};
