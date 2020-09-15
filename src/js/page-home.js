//const REFRESH_PACE = 60000;

// Globals
let locale = '';
let media = '';
const REFRESH_PACE = 180000;
//let map, userMarker, markerGroup, locaton;

//Listeners
document.addEventListener('DOMContentLoaded', (event) => {
  initPage();

  // Set locale
  locale =
    Locale.get() == null || Locale.get() == 'null'
      ? DeviceAdapter.getLocale()
      : Locale.get();

  console.log('[home::getLocale] ' + locale);

  // Check location and render content
  const cachedLocation = LocalStorage.getLocation();
  if (cachedLocation) {
    // Strategy: defer fwetching locatin by using the cached one
    renderCachedMedia(cachedLocation);
    refreshData();
  } else {
    // In case of no cache, there is no way to defer getLocation()
    DeviceAdapter.getLocation()
      .then((loc) => {
        LocalStorage.setLocation(loc);
        map.init(loc);
        return DBHelper.fetchMedia({ ...loc, locale });
      })
      .then((data) => {
        media = data ? data : [];
        return renderMedia();
      })
      .catch((err) => console.log(err));
  }

  keepRefreshingData(REFRESH_PACE);
});

//Intialize the home page
const initPage = () => {
  Analitics.initSentry();
  sw.renderVersion();
  DBHelper.checkConnectivity();
  sw.init();
  if (!LocalStorage.isTNCAccepted()) {
    console.log('[home:init] New user');
    document.getElementById('articles').classList.add('hidden');
    document.getElementById('osm-map').classList.add('hidden');
    return renderWelcomeScreen();
  }
};

// Anticipate rendering media by using the cached ones
const renderCachedMedia = (loc) => {
  map.init(loc);
  return DBHelper.getCachedMedia(loc).then((data) => {
    media = data ? data : [];
    return renderMedia();
  });
};

// Refresh job
const keepRefreshingData = (pace) =>
  setInterval(function () {
    refreshData();
  }, pace);

// Refresh the data - for instance - in a cronjob
const refreshData = () =>
  DeviceAdapter.getLocation()
    .then((loc) => {
      console.log('[home:refreshData] refresh! ' + loc.lat, loc.lon);
      LocalStorage.setLocation(loc);
      map.updatePosition(loc);
      map.clearMarkersGroup();
      return DBHelper.fetchMedia({ ...loc, locale });
    })
    .then((data) => {
      media = data ? data : [];
      return renderMedia();
    })
    .catch((err) => console.log(err));

// Print media list
const renderMedia = () => {
  const div = document.getElementById('articles');
  div.innerHTML = ''; //reset list
  if (media.lenght < 1 || media == '') {
    renderNoStory();
    return;
  }

  media.forEach((mediaItem) => {
    const { title, articleHTML, dist, type, article, id } = mediaItem;

    switch (type) {
      case 'audio':
        map.markAreaOfInterest({ ...mediaItem, color: 'green' });
        Card.renderAudioCard({ id, container: div, ...mediaItem });
        break;
      case 'story':
        map.markAreaOfInterest({
          ...mediaItem,
          color: 'blue',
          onClick: () => openCard(id)
        });
        Card.renderStoryCard({ id, container: div, ...mediaItem });
        break;
      case 'article':
        map.markAreaOfInterest({
          onClick: () => openCard(id, article),
          ...mediaItem
        });
        Card.renderArticleCard({ id, container: div, ...mediaItem });
        break;
      default:
        map.markAreaOfInterest(mediaItem);
        Card.renderArticleCard({ id, container: div, ...mediaItem });
    }
  });
};

// Print the welcome screen
const renderWelcomeScreen = () => {
  const div = document.getElementById('welcome-screen');
  div.classList.add('welcome-screen');

  const hero = document.createElement('div');
  hero.classList.add('jumbotron');

  const h2 = document.createElement('h2');
  h2.innerHTML = 'Your personal audioguide';

  const follow = document.createElement('p');
  follow.classList.add('follow');
  follow.innerHTML =
    'Wear your headphones and start to walk: Nevio will tell you the stories of the places around you.';

  const credits = document.createElement('p');
  credits.classList.add('credits');
  credits.innerHTML = 'Photo by Trust "Tru" Katsande on Unsplash';

  const cta = document.createElement('button');
  cta.classList.add('btn-cta');
  cta.setAttribute('onclick', `onDismissWelcomeScreen();`);
  cta.innerHTML = "I'm ready";

  hero.append(h2);
  hero.append(follow);
  hero.append(cta);

  div.append(hero);
  div.append(credits);
};

// In case no article available, try wiki
const renderNoStory = () => {
  const div = document.getElementById('articles');

  const h2 = document.createElement('h2');
  h2.classList.add('center');
  h2.innerHTML = 'No article found';

  const p = document.createElement('p');
  p.classList.add('container');
  p.innerHTML = `There is no article in your language for this area. If you have <b>the perfect article</b> for this place and you would like to contribute, what about writing a <a href="https://${locale}.wikipedia.org">Wiki article</a> for it?`;
  div.classList.add('one-column');
  div.append(h2);
  div.append(p);
};

// Open a card with a given ID
const openCard = (id, article) => {
  const selectedCard = document.getElementById(id);
  selectedCard.classList.add('card-expanded');
  if (article) {
    DeviceAdapter.speechSynthesis.play(article);
    DeviceAdapter.noSleep.enable();
  }
  return;
};

// Dismiss a card with a given ID
const dismissCard = (id) => {
  const selectedCard = document.getElementById(id);
  selectedCard.classList.remove('card-expanded');
  DeviceAdapter.speechSynthesis.stop();
  DeviceAdapter.noSleep.disable();
};

// Toggle Play/Pause
const togglePlayPause = (id) => {
  // Choose the first button appended to the footer of a given card
  const targetButton = document.getElementById(id).childNodes[2].childNodes[0];

  if (targetButton.className.includes('paused')) {
    targetButton.classList.remove('paused');
    DeviceAdapter.speechSynthesis.resume();
  } else {
    targetButton.classList.add('paused');
    DeviceAdapter.speechSynthesis.pause();
  }
};

const onDismissWelcomeScreen = () => {
  const div = document.getElementById('welcome-screen');
  LocalStorage.acceptTNC();
  div.classList.add('hidden');
  document.getElementById('articles').classList.remove('hidden');
  document.getElementById('osm-map').classList.remove('hidden');
};
