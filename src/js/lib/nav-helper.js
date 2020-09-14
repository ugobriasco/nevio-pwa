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
    { key: 'stories', label: 'Stories', link: './discover.html' },
    { key: 'settings', label: 'Settings', link: './settings.html' }
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
  //SideNav._renderLanguageSelection();
};

// SideNav._renderLanguageSelection = () => {
//   const languageAvailable = ['Default'].concat(Locale.getAvailable());
//   console.log(languageAvailable);
//
//   const container = document.getElementById('language-selection');
//
//   /*
//   <div id="sidenav-language-select" class="custom-select" onClick="SideNav.toggleDropDown()">
//       <div class="custom-select__trigger"><span>Tesla</span>
//           <div class="arrow"></div>
//       </div>
//       <div class="custom-options" >
//           <span class="custom-option selected" data-value="tesla">Tesla</span>
//           <span class="custom-option" data-value="volvo">Volvo</span>
//           <span class="custom-option" data-value="mercedes">Mercedes</span>
//       </div>
//   </div>
//
//   */
//
//   const box = document.createElement('div');
//   box.id = 'sidenav-language-select';
//   box.classList.add('custom-select');
//   box.setAttribute('onClick', 'SideNav.toggleDropDown()');
//   box.innerHTML = `<div class="custom-select__trigger"><span>${languageAvailable[0]}</span>
//       <div class="arrow"></div>
//   </div>`;
//
//   const select = document.createElement('div');
//   select.classList.add('custom-options');
//   languageAvailable.forEach((language, i) => {
//     const span = document.createElement('span');
//     span.classList.add('custom-option');
//     span.setAttribute('data-value', language);
//     span.innerHTML = language;
//     select.append(span);
//   });
//
//   box.append(select);
//   container.append(box);
// };
//
// SideNav.toggleDropDown = () => {
//   const select = document.getElementById('sidenav-language-select');
//   if (select.classList.contains('open')) {
//     select.classList.remove('open');
//   } else {
//     select.classList.add('open');
//   }
// };
