module.exports = function(connection){
  return function(req, res, next){
    req.connection = connection;
    next();
  };
};