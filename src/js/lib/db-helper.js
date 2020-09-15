const DBHelper = {};

DBHelper.API_ENDPOINT = CFG.NEVIO_API_ENDPOINT;
DBHelper.MEDIA_GEOSEARCH_RADIUS = 1000;
DBHelper.STORIES_GEOSEARCH_RADIUS = 5000;

// Check if there is internet connection, if not throw an allert
DBHelper.checkConnectivity = () => {
  return fetch(`${DBHelper.API_ENDPOINT}/status`, {
    method: 'HEAD'
  }).catch((err) => {
    console.log('You are offline');
    Alert.throwWarning('You are offline!');
    return err;
  });
};

// Get articles around the given location
DBHelper.fetchMedia = (props) => {
  const { lat, lon, locale } = props;
  const URL = `${DBHelper.API_ENDPOINT}/media?lat=${lat}&lon=${lon}&lang=${locale}&radius=${DBHelper.MEDIA_GEOSEARCH_RADIUS}`;
  const headers = {
    'Content-Type': 'application/json'
  };

  console.log(URL);

  return fetch(URL, { headers })
    .then((res) => res.json())
    .catch((err) => {
      console.log(
        err,
        '[dbHelper::fetchMedia] Connectivity error, serving media from cache'
      );
      return IDBHelper.getMedia();
    })
    .then((media) => IDBHelper.refreshMedia(media))
    .then(() => IDBHelper.getMedia())
    .catch((err) => {
      console.log(err, '[dbHelper::fetchMedia] Error by fetching from cache ');
    });
};

DBHelper.getCachedMedia = () => IDBHelper.getMedia();

// Get stories around the given location
DBHelper.fetchStories = (props) => {
  const { lat, lon, locale } = props;
  const URL = `${DBHelper.API_ENDPOINT}/story?lat=${lat}&lon=${lon}&lang=${locale}&radius=${DBHelper.STORIES_GEOSEARCH_RADIUS}`;
  const headers = {
    'Content-Type': 'application/json'
  };
  return fetch(URL, { headers })
    .then((res) => {
      if (res.status !== 200) {
        console.log(
          '[dbHelper::fetchStories] There was a problem: ' +
            URL +
            '' +
            res.status
        );
      } else {
        return res.json();
      }
    })
    .catch((err) =>
      console.log('[dbHelper::fetchStories] Fetch error: ' + err)
    );
};

// Get a single storz biy passing id, lat, lon´
DBHelper.fetchStoryById = (id, lat, lon) => {
  const URL =
    lat && lon
      ? `${DBHelper.API_ENDPOINT}/story/${id}?lat=${lat}&lon=${lon}`
      : `${DBHelper.API_ENDPOINT}/story/${id}`;

  const headers = {
    'Content-Type': 'application/json'
  };
  return fetch(URL, { headers })
    .then((res) => {
      if (res.status !== 200) {
        console.log(
          '[dbHelper::fetchStoryById] There was a problem: ' +
            URL +
            '' +
            res.status
        );
      } else {
        return res.json();
      }
    })
    .catch((err) =>
      console.log('[dbHelper::fetchStoryById] Fetch error: ' + err)
    );
};

// Story page URL.
DBHelper.urlForStory = (story) => `./story.html?id=${story.id}`;
