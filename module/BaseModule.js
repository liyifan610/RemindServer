function Base (connection) {
  this.connection = connection;
}

Base.prototype.setConnection = function(connection){
  this.connection = connection;
};

Base.prototype.getConnection = function(){
  return this.connection;
};

Base.prototype.execute = function(data, callback){
  var self = this;
  var fun = data.actionType;
  if(typeof self[fun] == 'function'){
    self[fun](data, callback);
  }
};

module.exports = Base;