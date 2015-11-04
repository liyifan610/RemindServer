var EventProxy = require('EventProxy');

/**
 * @param  {connection: connection of the database}
 * @param  {callback: callback when complete all the init work}
 * @return {void}
 */
module.exports = function(connection, callback){
  var proxy = new EventProxy();

  proxy.all('userTable', 'transaction', function(){
	  callback(null);
  });
  
  proxy.bind('error', function(error){
	  proxy.unbind();
    callback(error);
  });


  connection.beginTransaction(function(error){
  	if(error){
  		proxy.emit(error, error);
  	}
    //creare user table
    var userTableSql = 'create table if not exists user(' + 
				  	     'UserId int(8) not null auto_increment,'+ 
				  	     'UserName varchar(10) not null,'+ 
				  	     'Gender int(1),' +
                 'Email varchar(255),' +
				  	     'PRIMARY KEY(UserId)' + 
				  	   ')';
    connection.query(userTableSql, function(error, result){
  	  if(error){
	      return connection.rollback(function(){
		      proxy.emit('error', error);
		    });
	    }
	    proxy.emit('userTable');
    });

    //commit the transaction
    connection.commit(function(error){
	    if(error){
	      return connection.rollback(function(){
	        proxy.emit('error', error);
	      });
      }
	    proxy.emit('transaction');
    });

  });
};

