var util = require('util');
var Base = require('./BaseModule');
var sqlGenerator = require('../tool/GCTWUtils').sqlGenerator;

/**
 * @author lee
 * @param {connection:database connection}
 */
function DBHelper(connection){
  Base.call(this, connection);
}

util.inherits(DBHelper, Base);

DBHelper.prototype.insert = function(sqlData, callback){
  var self = this;
  var sql = sqlGenerator.insert(sqlData.table, 
                                sqlData.insertColumns, 
                                sqlData.insertData);
  self.connection.query(sql, function(err, result){
    if(err){
      callback(err);
    }else{
      callback(null, result.insertId);
    }
  });
};

DBHelper.prototype.update = function(sqlData, callback){
  var self = this;
  var sql = '';
  self.connection.query(sql, function(err, result){
    if(err){
      callback(err);
    }else{
      callback(null, result);
    }

  });
};

DBHelper.prototype.query = function(sqlData, callback){
  var self = this;
  var sql = sqlGenerator.query(sqlData.table, 
                               sqlData.resultColumns, 
                               sqlData.queryColumns, 
                               sqlData.queryData);
  self.connection.query(sql, function(err, result){
    if(err){
      callback(err);
    }else{
      callback(null, result[0]);
    }
  });
};

DBHelper.prototype.delete = function(sqlData, callback){
	
};

module.exports = DBHelper;
