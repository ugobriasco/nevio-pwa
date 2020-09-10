/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
const openNav = () => {
  document.getElementById('mySidebar').style.width = '60%';
  populateMenu();
  //document.getElementById('page-wrapper').style.marginLeft = '250px';
};

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
const closeNav = () => {
  document.getElementById('mySidebar').style.width = '0';
  //document.getElementById('page-wrapper').style.marginLeft = '0';
};

// Populate links in the sidebar
const populateMenu = () => {
  const locale = DeviceAdapter.getLocale();
  const list = [
    { key: 'home', label: 'Media', link: '/' },
    { key: 'stories', label: 'Stories', link: './discover.html' }
  ];

  const sidenav = document.getElementById('sidenav-items');
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
};
