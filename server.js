const sql = require('mssql');


var config = {
    user: 'CityForumDBAdmin',
    password: 'cloudService123',
    server: 'cityforumdatabase.c7xajpqu6x8l.eu-west-1.rds.amazonaws.com', 
    database: 'cityforumDB' 
};

var connection = sql.connect(config, function(err){
    if(err)
        throw err;
});

module.exports = sql;