// Globals
const REFRESH_PACE = 10000;
let _story = {};

document.addEventListener('DOMContentLoaded', event => {
  initPage();
  DeviceAdapter.getLocation()
    .then(loc => {
      map.init(loc);
      return fetchStoryFromUrl(loc);
    })
    .then(story => {
      _story = story;
      renderStory(story);
      renderChapters(story);
      return;
    })
    .catch(err => console.log(err));

  keepRefreshingData(REFRESH_PACE);
});

const initPage = () => {
  Analitics.initSentry();
  sw.renderVersion();
  DBHelper.checkConnectivity();
  sw.init();
};

const refreshData = () =>
  DeviceAdapter.getLocation()
    .then(loc => {
      console.log('[story:refreshData] refresh! ' + loc.lat, loc.lon);
      LocalStorage.setLocation(loc);
      map.updatePosition(loc);
      return fetchStoryFromUrl(loc);
    })
    .then(story => updateChapters(story))
    .catch(err => console.log(err));

// Refresh job
const keepRefreshingData = pace =>
  setInterval(function() {
    refreshData();
  }, pace);

const fetchStoryFromUrl = loc => {
  const id = getParameterByName('id');

  if (!id) {
    console.log('[story::fetchStoryFromUrl] No story ID in the URL');
    return;
  } else {
    const { lat, lon } = loc;
    return DBHelper.fetchStoryById(id, lat, lon).then(story => ({
      ...story,
      myLoc: loc
    }));
  }
};

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const renderStory = story => {
  const { title, description, author } = story;

  const div = document.getElementById('story-header');
  div.innerHTML = '';

  const h1 = document.createElement('h1');
  h1.innerHTML = title;

  const storyAuthor = document.createElement('p');
  storyAuthor.innerHTML = author;

  const storyIntro = document.createElement('p');
  storyIntro.innerHTML = description;

  div.append(h1);
  div.append(storyAuthor);
  div.append(storyIntro);
};

const renderChapters = story => {
  const { chapters, myLoc, lat, lon } = story;

  const container = document.getElementById('chapters');
  container.innerHTML = ''; //reset list

  return chapters.forEach(chapter => {
    map.markAreaOfInterest({ ...chapter, color: 'blue' });
    const id = chapter.id;
    Card.renderAudioCard({ id, container, ...chapter });
    evaluateCard(id, chapter, myLoc);
  });
};

const updateChapters = story => {
  const { chapters, myLoc, lat, lon } = story;
  return chapters.forEach(chapter => {
    const id = chapter.id;
    return evaluateCard(id, chapter, myLoc);
  });
};

const activateCard = id => {
  const card = document.getElementById(id);
  card.classList.add('card-active');
  document.getElementById(`audio-${id}`).removeAttribute('hidden');
};

const deactivateCard = id => {
  const card = document.getElementById(id);
  card.classList.remove('card-active');
  document.getElementById(`audio-${id}`).setAttribute('hidden', 'true');
};

const evaluateCard = (id, chapter, myLoc) => {
  const distance = Distance.inMeters(
    myLoc.lat,
    myLoc.lon,
    chapter.lat,
    chapter.lon
  );
  Card.updateDistance(id, distance);
  if (distance <= chapter.area.radius) {
    activateCard(id);
  } else {
    deactivateCard(id);
  }
};
