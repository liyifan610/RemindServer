module.exports = function(redis){
  return function(req, res, next){
    req.redis = redis;
    next();
  };
};