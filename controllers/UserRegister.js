var Base = require('./BaseController.js');
var util = require('util');
var DBHelper = require('../module/DBHelper');

function UserRegister(){
  Base.call(this);
}

util.inherits(UserRegister, Base);

UserRegister.prototype.run = function(req, res, next){
  UserRegister.super_.prototype.run.call(req, res, next);
  var statusCode;
  var responseData;

  if(invalidBody(req.body)){
    var sqlData = {
    	table : 'user',
    	actionType : 'insert'
    };
    
    sqlData.insertColumns = [];
    sqlData.insertData = [];

    for(var prop in req.body){
      if(req.body.hasOwnProperty(prop)){
        sqlData.insertColumns.push(prop);
        sqlData.insertData.push(req.body[prop]);
      }
    }

    var dBHelper = new DBHelper(req.connection);
    dBHelper.execute(sqlData, function(err, userId){
      if(err){
        statusCode = 500;
        responseData = {status:-1};
      }else{
        statusCode = 200;
        responseData = {status:0, userId:userId};
      }
      res.status(statusCode).json(responseData);
    });
  }else{
    statusCode = 400;
    responseData = {status:-1};  
    res.status(statusCode).json(responseData);
  }
};

function invalidBody(body){
  if(!body.UserName){
  	return false;
  }
  return true;
}

module.exports = UserRegister;  

