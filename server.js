var express = require('express');
var app = express();
const sql = require('mssql');

var config = {
    user: 'CityForumDBAdmin',
    password: 'cloudService123',
    server: 'cityforumdatabase.c7xajpqu6x8l.eu-west-1.rds.amazonaws.com', 
    database: 'cityforumDB' 
};

app.get('/', function(req, res) 
{
    // Connect to database
    sql.connect(config, function (err) 
    {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select * from Account', function (err, recordset) 
        {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            
        });
    });

});

var server = app.listen(5000, function () 
{
    console.log('Server is running..');
});