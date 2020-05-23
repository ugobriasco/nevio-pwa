const Distance = {};

Distance.inMeters = (lat1, lon1, lat2, lon2) => {
  // A = sin²(Δpsi/2) + cos(φ1)⋅cos(φ2)⋅sin²(Δλ/2)
  // δ = 2·atan2(√(a), √(1−a))
  // see mathforum.org/library/drmath/view/51879.html for derivation

  const radius = 6371;
  const psi1 = Distance.degreeToRadians(lat1);
  const lambda1 = Distance.degreeToRadians(lon1);
  const psi2 = Distance.degreeToRadians(lat2);
  const lambda2 = Distance.degreeToRadians(lon2);
  const deltaPsi = psi2 - psi1;
  const deltaLambda = lambda2 - lambda1;

  const a =
    Distance.sine(deltaPsi) * Distance.sine(deltaPsi) +
    Distance.cos(psi1) *
      Distance.cos(psi2) *
      Math.pow(Distance.sine(deltaLambda), 2);
  const dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * radius;
  return dist.toFixed(0);
};

Distance.sine = num => Math.sin(num / 2);
Distance.cos = num => Math.cos(num);

Distance.degreeToRadians = degrees => {
  // Math.PI / 180
  if (!degrees || isNaN(degrees)) {
    throw new Error('Missing degrees as input parameter');
  }

  return degrees * 17.453292519943295;
};
