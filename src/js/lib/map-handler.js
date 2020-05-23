const colors = {
  orange: '#f58500',
  blue: '#23527c',
  red: '#F52F57',
  green: '#255957'
};

// Container
const map = {
  userMarker: '',
  markersGroup: '',
  _: ''
};

// Initialize map
map.init = props => {
  const { lat, lon } = props;
  console.log('[map::init] ' + lat + ',' + lon);

  // Get container
  const element = document.getElementById('osm-map');
  element.style = 'height:40%;';

  // Draw map centered to current position
  map._ = L.map(element);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map._);
  map._.setView(L.latLng(lat, lon), 16);

  // add markers to map
  map.userMarker = L.marker([lat, lon]).addTo(map._);
  map.markersGroup = L.layerGroup().addTo(map._);
};

// Update position of the main marker
map.updatePosition = props => {
  if (!props) return;
  const { lat, lon } = props;
  map.userMarker.setLatLng([lat, lon]);
  map._.setView(L.latLng(lat, lon), 16);
  return;
};

// Add area of interest to map
map.markAreaOfInterest = props => {
  if (!props) return;
  const { lat, lon, color, onClick } = props;
  L.circleMarker([lat, lon], {
    color: colors[color ? color : 'orange']
  })
    .addTo(map.markersGroup)
    .on(
      'click',
      onClick
        ? onClick
        : () => {
            console.log('click');
          }
    );
};

// Clear all areas of interests
map.clearMarkersGroup = () => map.markersGroup.clearLayers();
