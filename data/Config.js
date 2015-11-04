/**
 * database config
 * @type {Object}
 */
exports.db = {
  //database
  host : 'localhost',
  user : 'root',
  password : 'w19920610',
  database : 'RemindServer',
  debug : false
};

exports.redis = {
  host : 'localhost',
  port : 6379,
  password : 'w19920610'
};

/**
 * websocket config
 * @type {Object}
 */
exports.ws = {
  interval : 5000,
  minDistance : 500
};

/**
 * app config
 * @type {Object}
 */
exports.app = {
  port : 3000,
  mode : 'dev'
};