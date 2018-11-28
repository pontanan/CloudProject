<<<<<<< HEAD
var sql = require("mssql");

const connection = new sql.ConnectionPool({
    user: 'CityForumDBAdmin',
    password: 'cloudService123',
    server: 'cityforumdatabase.c7xajpqu6x8l.eu-west-1.rds.amazonaws.com',
    database: 'cityforumDB'
})
 
connection.connect(err => {
    if(err) console.log(err);
})

module.exports = connection; 
=======
const sql = require('mssql')

var config = {
  user: 'CityForumDBAdmin',
  password: 'cloudService123',
  server: 'cityforumdatabase.c7xajpqu6x8l.eu-west-1.rds.amazonaws.com',
  database: 'cityforumDB'
}

var connection = sql.connect(config, function (err) {
  if (err) console.log(err)
})

module.exports = sql
>>>>>>> 8b6204356759eeef16448ec3bea690e617142bc0
