const Card = {};

Card.renderAudioCard = props => {
  const { id, title, dist, container } = props;
  if (!validateInput) {
    return;
  }

  // Define card
  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;

  // Create common sections
  const cardHeader = renderCardHeader({ title, dist, id });

  // Create card-specific sections
  const audioContainer = document.createElement('div');
  audioContainer.className = 'audio-container';

  const audio = document.createElement('audio');
  audio.setAttribute('controls', '');
  audio.id = `audio-${id}`;

  const source = document.createElement('source');
  source.setAttribute('src', `${DBHelper.API_ENDPOINT}/api/audio/${id}/play`);
  source.setAttribute('type', 'audio/mpeg');

  //Compose
  audio.append(source);
  audioContainer.append(audio);
  card.append(cardHeader);
  card.append(audioContainer);

  container.append(card);
};

Card.renderArticleCard = props => {
  const { id, title, dist, container, articleHTML, article } = props;
  if (!validateInput) {
    return;
  }

  // Define card
  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;

  // Create common sections
  const cardHeader = renderCardHeader({ title, dist, id });

  //specific
  cardHeader.setAttribute('onclick', `openCard("${id}", "${article}");`);

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  cardBody.innerHTML = `<p>${articleHTML}</p>`;

  const cardFooter = document.createElement('div');
  cardFooter.className = 'card-footer';

  const buttonClose = document.createElement('button');
  buttonClose.className = 'btn-close';
  buttonClose.setAttribute('onclick', `dismissCard(${id});`);
  buttonClose.innerHTML = '<strong>Close</strong>';

  const buttonPlay = document.createElement('button');
  buttonPlay.className = 'btn-play';
  buttonPlay.setAttribute('onclick', `togglePlayPause(${id});`);

  //Compose
  cardFooter.append(buttonPlay);
  cardFooter.append(buttonClose);
  card.append(cardHeader);
  card.append(cardBody);
  card.append(cardFooter);
  container.append(card);
};

Card.renderStoryCard = props => {
  const { id, title, dist, container, description, author } = props;
  if (!validateInput) {
    return;
  }

  // Define card
  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;

  // Create common sections
  const cardHeader = renderCardHeader({ title, dist, id });

  //specific
  cardHeader.setAttribute('onclick', `openCard("${id}");`);

  const storyURL = DBHelper.urlForStory(props);

  const authorSection = document.createElement('div');
  authorSection.className = 'sub-header';
  authorSection.innerHTML = `<p>${author}</p>`;

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  cardBody.innerHTML = `<p>${description}</p>`;

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
  cardFooter.append(buttonGoTo);
  cardFooter.append(buttonClose);
  card.append(cardHeader);
  card.append(authorSection);
  card.append(cardBody);
  card.append(cardFooter);
  container.append(card);
};

const validateInput = props => {
  if (!props.id) {
    console.log('[Components::Card] missing card id. Card not rendered');
    return false;
  }

  if (!props.container) {
    console.log(
      '[Components::Card] container not specified. Card not rendered'
    );
    return false;
  }

  return true;
};

const renderCardHeader = props => {
  const { title, dist, id } = props;

  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header';

  const h2 = document.createElement('h2');
  h2.innerHTML = title;

  const cardHeaderRight = document.createElement('div');
  cardHeaderRight.className = 'card-header-right';
  cardHeaderRight.id = `card-${id}-dist`;
  cardHeaderRight.innerHTML = `<p>${parseFloat(dist).toFixed(0)} m</p>`;

  const cardHeaderCenter = document.createElement('div');
  cardHeaderCenter.className = 'card-header-center';

  cardHeaderCenter.append(h2);
  cardHeader.append(cardHeaderCenter);
  cardHeader.append(cardHeaderRight);

  cardHeaderCenter.append(h2);
  cardHeader.append(cardHeaderCenter);
  cardHeader.append(cardHeaderRight);

  return cardHeader;
};

// Actions

Card.updateDistance = (cardID, newDistance) => {
  const target = document.getElementById(`card-${cardID}-dist`);
  if (target) {
    target.innerHTML = `<p>${parseFloat(newDistance).toFixed(0)} m</p>`;
  }
  return;
};
