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
  const list = [
    { label: 'Media', link: '/' },
    { label: 'Sotries', link: './discover.html' }
  ];

  const sidenav = document.getElementById('sidenav-items');
  sidenav.innerHTML = '';

  list.forEach((item) => {
    let a = document.createElement('a');
    console.log(item);
    a.href = item.link;
    a.innerHTML = item.label;
    sidenav.append(a);
  });
};
