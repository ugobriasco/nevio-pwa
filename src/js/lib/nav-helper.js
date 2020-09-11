const SideNav = {};

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
SideNav.open = () => {
  document.getElementById('mySidebar').style.width = '60%';
  SideNav._populate();
  //document.getElementById('page-wrapper').style.marginLeft = '250px';
};

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
SideNav.close = () => {
  document.getElementById('mySidebar').style.width = '0';
  //document.getElementById('page-wrapper').style.marginLeft = '0';
};

// Populate links in the sidebar
SideNav._populate = () => {
  const locale = DeviceAdapter.getLocale();
  const list = [
    { key: 'home', label: 'Media', link: '/' },
    { key: 'stories', label: 'Stories', link: './discover.html' }
  ];

  const sidenav = document.getElementById('sidenav-links');
  sidenav.innerHTML = '';

  list.forEach((item) => {
    /*
    Skip rendering sotries if the locale is it-IT.
    The section "Stories" is still in alpha track thus it should not be rolled out fully
    */
    if (item.label == 'Stories' && locale != 'it-IT') {
      return;
    }
    let a = document.createElement('a');
    a.href = item.link;
    a.innerHTML = item.label;
    sidenav.append(a);
  });
  SideNav._renderLanguageSelection();
};

SideNav._renderLanguageSelection = () => {
  const languageAvailable = Locale.getAvailable();
  console.log(languageAvailable);

  const div = document.getElementById('language-selection');
  const select = document.createElement('select');
  select.classList.add('language-select');
  languageAvailable.forEach((language, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.innerHTML = language;
    select.append(option);
  });
  div.append(select);
};
