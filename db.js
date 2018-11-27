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