const dbPromise = idb.open('nevio-db', 3, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      let mediaStore = upgradeDb.createObjectStore('media', {
        keyPath: 'id'
      });
    case 1:
      let storiesStore = upgradeDb.createObjectStore('stories', {
        keyPath: 'id'
      });
    case 2:
      mediaStore = upgradeDb.transaction.objectStore('media');
      mediaStore.createIndex('id', 'id');
  }
});

const IDBHelper = {};

// Fetch idb with medias
IDBHelper.refreshMedia = media =>
  dbPromise.then(db => {
    const tx = db.transaction('media', 'readwrite');
    const store = tx.objectStore('media');
    const mediaIndex = store.index('id');
    //delete medias in _store
    mediaIndex
      .openCursor()
      .then(cursor => deleteRest(cursor))
      .then(() => {
        media.map(mediaObject => tx.objectStore('media').put(mediaObject));
        return tx.complete;
      });
  });

IDBHelper.getMedia = () =>
  dbPromise.then(db => {
    const tx = db.transaction('media');
    const store = tx.objectStore('media');
    return store.getAll();
  });

IDBHelper.refreshStories = stories => {
  dbPromise.then(db => {
    const tx = db.transaction('stories', 'readwrite');
    const store = tx.objectStore('stories');
    stories.map(story => tx.objectStore('stories').put(story));
    return tx.complete;
  });
};

IDBHelper.getStories = () => {
  dbPromise.then(db => {
    const tx = db.transaction('stories');
    const store = tx.objectStore('stories');
    return store.getAll();
  });
};

function deleteRest(cursor) {
  if (!cursor) return;
  cursor.delete();
  return cursor.continue().then(deleteRest);
}
