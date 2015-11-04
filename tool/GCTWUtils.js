var mysql = require('mysql');
var Q = require('q');
var sqlEscape = mysql.escape;

/**
 * mothod promisify
 * @param  {[type]} method [description]
 * @return {[type]}        [description]
 */
exports.promisify = function(object, method){
  return function(){
    var deferred = Q.defer();
    var args = Array.prototype.slice.call(arguments, 0);
    args.push(deferred.makeNodeResolver());
    method.apply(object, args);
    return deferred.promise;
  };
};

// determine whether two coordinates are in the certain distance()
exports.distance = function(ca, cb, minDistance){
  var lat1 = ca.latitude;
  var lng1 = ca.longitude;
  var lat2 = cb.latitude;
  var lng2 = cb.longitude;
  if ((Math.abs(lat1) > 90  ) || (Math.abs(lat2) > 90 )) {
    return false;
  }
  if ((Math.abs(lng1) > 180  ) || (Math.abs(lng2) > 180 )) {
    return false;
  }
  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var a = radLat1 - radLat2;
  var b = rad(lng1) - rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                                  Math.cos(radLat1) * 
                                  Math.cos(radLat2) * 
                                  Math.pow(Math.sin(b / 2), 2)));
  // private const double EARTH_RADIUS = 6378.137;
  s = s * 6378.137;
  // EARTH_RADIUS; unit:Km
  s = Math.round(s * 10000) / 10000;
  
  if(s*1000 < minDistance){
    return true;
  }else{
    return false;
  }
};


function rad(d) {
  return d * Math.PI / 180.0;
}

// generate insert sql
function insertSql(table, insertColumns, insertData){
  var sql = 'insert into ' + table;
  var i;
  sql = sql + ' (';
  for(i = 0; i < insertColumns.length; i++){
  	if(i === 0){
      sql = sql + insertColumns[i];
  	}else{
      sql = sql + ',' + insertColumns[i];
    }
  }
  sql = sql + ') values (';
  for(i = 0; i < insertData.length; i++){
    if(i === 0){
      sql = sql + sqlEscape(insertData[i]);
    }else{
      sql = sql + ',' +sqlEscape(insertData[i]);
    }
  }
  sql += ')';
  return sql;
}

// generate query sql
function querySql(table, resultColumns, queryColumns, queryData){
  var i;
  var err = invalidQuery(resultColumns, queryColumns, queryData);
  if(err){
  	return err;
  }
  var sql = 'select';
  if(resultColumns === '*'){
    sql += ' * ';
  }else{
    for(i = 0; i < resultColumns.length; i++){
      if(i === 0){
  	    sql = sql + ' ' + sqlEscape(resultColumns[i]);
  	  }else{
  	    sql = sql + ', ' + sqlEscape(resultColumns[i]);
  	  }
    }
  }

  sql += ' from ' + table;
  if(queryColumns && queryColumns.length > 0){
    sql += ' where ';
  }else{
  	return sql;
  }
  for(i = 0; i < queryColumns.length; i++){
  	if(i ===0){
      sql = sql + queryColumns[i] + '=' + sqlEscape(queryData[i]);
  	}else{
      sql += ' and ' + queryColumns[i] + '=' +  sqlEscape(queryData[i]);
  	}
  }
  return sql;
}

// generate update sql
function updateSql(table, updateColumns, updateData){

}

// generate delete sql
function deleteSql(table, queryColums, queryData){

}

// invalid the query generator params
function invalidQuery(resultColumns, queryColumns, queryData){
  var err = null;
  if(resultColumns !== '*' && 
       resultColumns.constructor !== Array){
  	err = {
  		errMSG : 'result columns not valid'
  	};
  }
  if(queryColumns){
  	if(queryColumns.constructor !== Array){
  		err = {
  			errMSG : 'query columns not valid'
  		};
  		return err;
  	}
  	if(!queryData || queryData.constructor !== Array){
  		err = {
  			errMSG : 'query data not valid'
  		};
  		return err;
  	}
  	if(queryColumns.length !== queryData.length){
      err = {
        errMSG : 'query columns and query data not match'
  	  };
  	  return err;	
  	}
  }
  return err;
}

function invalidInsert(insertColumns, insertData){}

function invalidUpdates(updateColumns, updateData, queryColumns, queryData){}

function invalidDelete(queryColumns, queryData){}

/**
 * sql generator object
 * @author lee
 * @type {Object}
 */	
exports.sqlGenerator = {
  insert : insertSql,
  query : querySql,
  update : updateSql,
  delete : deleteSql
};

exports.sqlEscape = sqlEscape;






