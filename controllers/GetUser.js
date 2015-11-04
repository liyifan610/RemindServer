var Base = require('./BaseController');
var util = require('util');
var DBHelper = require('../module/DBHelper');
var err = require('../data/GlobalData').Error;

/**
 * controller to get the user info from database
 * @author lee
 */
function GetUser(){
  Base.call(this);
}

util.inherits(GetUser, Base);

GetUser.prototype.run = function(req, res, next){
  GetUser.super_.prototype.run.call(this, req, res, next);
  if(!req.connection){
	  next(err.MiddleWareEror);
  }else if(!req.query.UserName && !req.query.UserId){
	  next(err.URLQueryError);
  }else{
	  
    var sqlData = {
      table : 'user',
	    actionType : 'query',
      resultColumns : '*'
  	};
    
    if(req.query.userId){
      sqlData.queryColumns = ['UserId'];
      sqlData.queryData = [req.query.userId];
    }else if(req.query.userName){
      sqlData.queryColumns = ['UserName'];
      sqlData.queryData = [req.query.userName];
    }

    var dbHelper = new DBHelper(req.connection);
    dbHelper.execute(sqlData, function(err, result){
      if(err){
	      next(err);
	    }else{
	      res.send({status : 0, result : result});
	    }
    });
  }
};

module.exports = GetUser;