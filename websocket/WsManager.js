var DBHelper = require('../module/DBHelper');
var gctwUtils = require('../tool/GCTWUtils');
var WsConfig = require('../data/Config').ws;
var clientsInRedis = 'clients';

function WsManager(wsServer, connection, redis){
  this.wsServer = wsServer;
  this.redis = redis;
  this.dBHelper = new DBHelper(connection);
}


WsManager.prototype.setUserInfoInCache = function(userId, socketId){
  var self = this;
  var channel = self.wsServer.uploadCoordinates;
  var response = {};
  var getUserFromDB = gctwUtils.promisify(this, self.getUserInfo);
  var setClientInRedis = gctwUtils.promisify(self.redis, self.redis.rpush);

  getUserFromDB(userId).then(function(userInfo){
    userInfo.SocketId = socketId;
    return setClientInRedis(clientsInRedis, JSON.stringify(userInfo));
  },function(err){
    response.status = -1;
    response.err = err;
    channel.to(socketId).emit('uploadUserId', JSON.stringify(response));
  }).then(function(){
    response.status = 0;
    channel.to(socketId).emit('uploadUserId', JSON.stringify(response));
  }, function(err){
    response.status = -1;
    response.err = err;
    channel.to(socketId).emit('uploadUserId', JSON.stringify(response));
  });
};

WsManager.prototype.setCoordinates = function(userId, coordinates, socketId){
  var self = this;
  var i;
  var channel = self.wsServer.uploadCoordinates;
  var response = {};
  var getClientsInRedis = gctwUtils.promisify(self.redis, self.redis.lrange);
  var setClientInRedis = gctwUtils.promisify(self.redis, self.redis.lset);
  getClientsInRedis(clientsInRedis, 0, -1).then(function(reply){
    for(i = 0; i < reply.length; i++){
      var client = JSON.parse(reply[i]);
      if(client.SocketId === socketId &&
        client.UserId === userId){
        client.coordinates = coordinates;
        return setClientInRedis(clientsInRedis, i, JSON.stringify(client));
      }
    }
  }).then(function(){
    response.status = 0;
    channel.to(socketId).emit('uploadCoordinates', JSON.stringify(response));
  });
};

WsManager.prototype.removeUserInfoInCache = function(socketId){
  var self = this;
  var i;
  
  var getClientsInRedis = gctwUtils.promisify(self.redis, self.redis.lrange);
  var removeClientInRedis = gctwUtils.promisify(self.redis, self.redis.lrem);

  getClientsInRedis(clientsInRedis, 0, -1).then(function(reply){
    var client;
    for(i = 0; i < reply.length; i++){
      client = JSON.parse(reply[i]);
      if(client.SocketId === socketId){
        removeClientInRedis(clientsInRedis, 0, reply[i]);
      }
    }
  });
};

WsManager.prototype.getUserInfo = function(userId){
  var self = this;

  var sqlData = {
    table : 'user',
    actionType : 'query',
    resultColumns : '*',
    queryColumns : ['UserId'],
    queryData : [userId]
  };

  self.dBHelper.execute(sqlData, arguments[1]);
};

WsManager.prototype.updateUserInfoInDB = function(updateData, callback){
  var self = this;

  var sqlData = {
    table : 'user',
    actionType : 'update',
    updateColumns : '*',
    updateData : updateData
  };
  
  self.dBHelper.execute(sqlData, function(err, result){
    if(err){
      callback(err);
    }else{
      console.log(result);
      callback(null, result);
    }
  });
};

WsManager.prototype.nearbyClientsHandler = function(){
  var self = this;
  // var users = self.wsServer.users;
  var getClientsInRedis = gctwUtils.promisify(self.redis, self.redis.lrange);
  var i;

  getClientsInRedis(clientsInRedis, 0, -1).then(function(reply){
    var clients = [];
    for(i = 0; i < reply.length; i++){
      clients.push(JSON.parse(reply[i]));
    }
    broadcastClients(self.wsServer.uploadCoordinates, clients);
  });
};

function broadcastClients(channel, clients){
  var i;
  var j;
  for(i = 0; i < clients.length; i++){
    for(j = i+1; j < clients.length; j++){
      if(!clients[i] || !clients[j]){
        break;
      }
      if(!clients[i].coordinates || !clients[j].coordinates){
        break;
      }
      if(gctwUtils.distance(clients[i].coordinates, 
          clients[j].coordinates, 
          WsConfig.minDistance)){
        
        if(!clients[i].NearbyClients){
          clients[i].NearbyClients = [{
            UserId : clients[j].UserId,
            UserName : clients[j].UserName            
          }];
        }else{
          clients[i].NearbyClients.push({
            UserId : clients[i].UserId,
            UserName : clients[i].UserName
          });
        }

        if(!clients[j].NearbyClients){
          clients[j].NearbyClients = [{
            UserId : clients[i].UserId,
            UserName : clients[i].UserName
          }];
        }else{
          clients[j].NearbyClients.push({
            UserId : clients[i].UserId,
            UserName : clients[i].UserName
          });
        }
      }
    }
  }
  
  for(i = 0; i < clients.length; i++){
    if(!clients[i]){
      break;
    }
    channel.to(clients[i].SocketId).emit('nearbyClients', 
      JSON.stringify(clients[i].NearbyClients));
  }
}

module.exports = WsManager;