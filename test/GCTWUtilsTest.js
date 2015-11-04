var gctwUtils = require('../tool/GCTWUtils');

var ca = {
  latitude : -80,
  longitude : 80
};

var cb = {
  latitude : -10,
  longitude : 150
};

var result = gctwUtils.distance(ca, cb, 500);
console.log(result);