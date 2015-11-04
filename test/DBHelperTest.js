var DBHelper = require('../module/DBHelper');
var config = require('../data/Config');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host : config.db.host,
  user : config.db.user,
  password : config.db.password,
  database : config.db.database,
  debug : config.db.debug
});

var dBHelper = new DBHelper(connection);
