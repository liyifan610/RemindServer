exports.UserDBHelperInfo = {
  insert : 'insert',
  query : 'query',
  update : 'update',
  delete : 'delete',
  queryAll : 'queryAll'
};

exports.wsResultType = {
	uploadClientId : 1,
	uploadCoordinates : 2,
	nearbyClientsInfo : 3
};

exports.Error = {	
  MiddleWareEror : {status:500, message:'middleware has error'},
  DBError : {status:500, message:'error occur when operate the database'},
  NotFoundError : {status:404, message:'page no found'},
  URLQueryError : {status:500, message:'url query string error'}
};
