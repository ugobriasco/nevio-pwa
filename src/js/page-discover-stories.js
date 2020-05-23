// Globals
let locale = '';
let stories = '';
const REFRESH_PACE = 180000;

document.addEventListener('DOMContentLoaded', event => {
  initPage();
  locale = DeviceAdapter.getLocale();
  console.log('[discoveryStories::getLocale] ' + locale);
  DeviceAdapter.getLocation()
    .then(loc => {
      map.init(loc);
      return DBHelper.fetchStories(loc);
    })
    .then(data => {
      stories = data;
      return renderStories();
    })
    .catch(err => console.log(err))
    .then(() =>
      setInterval(function() {
        refreshData();
      }, REFRESH_PACE)
    );
});

const initPage = () => {
  Analitics.initSentry();
  sw.renderVersion();
  DBHelper.checkConnectivity();
  sw.init();
};

const refreshData = () => {
  DeviceAdapter.getLocation().then(loc => {
    console.log('[discoveryStories:refreshData] refresh! ' + loc.lat, loc.lon);
    map.updatePosition(loc);
  });
};

const renderStories = () => {
  const div = document.getElementById('stories');
  if (!stories || stories.length < 1) {
    return renderNoStory();
  }

  const p = document.createElement('p');
  p.classList.add('center');
  p.innerHTML =
    'Do you have an amazing story for this place an would you like to contibute? <a href="mailto:hi@ugobriasco.me?subject=Nevio,I have a story for you!">reach us out!</a> We are looking for brilliant content creators.';

  stories.forEach(story => {
    map.markAreaOfInterest({ ...story, color: 'blue' });

    const id = stories.indexOf(story);

    const card = document.createElement('div');
    card.className = 'card';
    card.id = id;

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.setAttribute('onclick', `openCard("${id}");`);

    const cardHeaderCenter = document.createElement('div');
    cardHeaderCenter.className = 'card-header-center';

    const h2 = document.createElement('h2');
    h2.innerHTML = story.title;

    const cardHeaderRight = document.createElement('div');
    cardHeaderRight.className = 'card-header-right';
    cardHeaderRight.innerHTML = `<p>${parseFloat(story.dist).toFixed(0)} m</p>`;

    const storyURL = DBHelper.urlForStory(story);

    const author = document.createElement('div');
    author.innerHTML = `<p>${story.author}</p>`;

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardBody.innerHTML = `<p>${story.description}</p>`;

    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';

    const buttonClose = document.createElement('button');
    buttonClose.className = 'btn-close';
    buttonClose.setAttribute('onclick', `dismissCard(${id});`);
    buttonClose.innerHTML = '<strong>Close</strong>';

    const buttonGoTo = document.createElement('button');
    buttonGoTo.className = 'btn-primary';
    buttonGoTo.setAttribute('type', `button`);
    buttonGoTo.setAttribute('onclick', `location.href='${storyURL}'`);
    buttonGoTo.innerHTML = 'Get the story';

    //Compose
    cardHeaderCenter.append(h2);
    cardHeaderCenter.append(author);
    cardHeader.append(cardHeaderCenter);
    cardHeader.append(cardHeaderRight);
    cardFooter.append(buttonGoTo);
    cardFooter.append(buttonClose);
    card.append(cardHeader);
    card.append(cardBody);
    card.append(cardFooter);
    div.append(card);
  });
  div.append(p);
};

const renderNoStory = () => {
  const div = document.getElementById('stories');

  const h2 = document.createElement('h2');
  h2.classList.add('center');
  h2.innerHTML = 'No story found';

  const p = document.createElement('p');
  p.classList.add('container');
  p.innerHTML =
    'There is no tale in your language for this area. If you have <b>the perfect story</b> for this place and you would like to contribute, <a href="mailto:hi@ugobriasco.me?subject=Nevio,I have a story for you!">reach us out!</a> We are looking for brilliant content creators.';
  div.classList.add('one-column');
  div.append(h2);
  div.append(p);
};

// Open a card with a given ID
const openCard = id => {
  const selectedCard = document.getElementById(id);
  selectedCard.classList.add('card-expanded');
  if (stories[id].article) {
    DeviceAdapter.speechSynthesis.play(stories[id].article);
    DeviceAdapter.noSleep.enable();
  }
  return;
};

// Dismiss a card with a given ID
const dismissCard = id => {
  const selectedCard = document.getElementById(id);
  selectedCard.classList.remove('card-expanded');
  DeviceAdapter.speechSynthesis.stop();
  DeviceAdapter.noSleep.disable();
};
