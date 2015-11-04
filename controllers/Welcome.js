var util = require('util');
var Base = require('./BaseController');

function Welcome(){
  Base.call(this);
}

util.inherits(Welcome, Base);

Welcome.prototype.run = function(req, res, next){
  Welcome.super_.prototype.run.call(this, req, res, next);
  res.status(200).render('index');
};

module.exports = Welcome;
