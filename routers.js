var express = require('express');
var Welcome = require('./controllers/Welcome');
var GetUser = require('./controllers/GetUser');
var UserRegister = require('./controllers/UserRegister');
var router = express.Router();

//show root welcome page
router.get('/', function(req, res, next){
  var welcome = new Welcome();
  welcome.run(req, res, next);
});

router.get('/user/getUser', function(req, res, next){
  var getUser = new GetUser();
  getUser.run(req, res, next);
});

router.post('/user/register', function(req, res, next){
  var userRegister = new UserRegister();
  userRegister.run(req, res, next);
});

module.exports = router;