const TYPES_AVALIABLE = ['info', 'success', 'warning'];
const DEFAULT_CONTAINER = 'alert-container';

const Alert = {
  container: 'alert-container'
};

Alert.throwSuccess = text =>
  Alert.render({
    type: 'success',
    text
  });

Alert.throwInfo = text =>
  Alert.render({
    type: 'info',
    text
  });

Alert.throwWarning = text =>
  Alert.render({
    type: 'warning',
    text
  });

Alert.throwError = text =>
  Alert.render({
    type: 'danger',
    text
  });

Alert.dismissAlert = id => {
  const alert = document.getElementById(id);
  alert.style.opacity = '0';
  return setTimeout(function() {
    alert.style.display = 'none';
  }, 600);
};

Alert.render = props => {
  const { text, type } = props;

  const bannerId = new Date().getUTCMilliseconds().toString();

  console.log(`[Alert::render]${type} alert ${bannerId}`);

  const _closeBtn = document.createElement('span');
  _closeBtn.classList.add('closebtn');
  _closeBtn.innerHTML = '&times';
  _closeBtn.setAttribute('onClick', `Alert.dismissAlert(${bannerId})`);

  const _text = document.createElement('strong');
  _text.innerHTML = text;

  const _banner = document.createElement('div');
  _banner.classList.add('alert');
  _banner.setAttribute('id', bannerId);
  _banner.classList.add(type);
  _banner.append(_closeBtn);
  _banner.append(_text);

  const _container = document.getElementById(Alert.container);
  _container.append(_banner);

  setTimeout(function() {
    Alert.dismissAlert(bannerId);
  }, 10000);
};
