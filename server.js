var express = require('express');
var app = express();
const sql = require('mssql');
const {google} = require('googleapis');
var fs = require("fs");

var authContent = fs.readFileSync("authorisation/client_auth.json");
var jsonAuthContent = JSON.parse(authContent);

const oauth2Client = new google.auth.OAuth2(
    jsonAuthContent.web.client_id,
    jsonAuthContent.web.client_secret,
    jsonAuthContent.web.redirect_uris
);

const scopes = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

const url = oauth2Client.generateAuthUrl(
{
    access_type: 'offline',
    scope: scopes
});

const pool = new sql.ConnectionPool({
    user: 'CityForumDBAdmin',
    password: 'cloudService123',
    server: 'cityforumdatabase.c7xajpqu6x8l.eu-west-1.rds.amazonaws.com', 
    database: 'cityforumDB' 
});

app.get('/', function(req, res) 
{
    // Connect to database
    

    res.redirect(301, url)
    res.end();

});

app.get('/auth', function(req, res) 
{

    var access_token = req.query.code;
    //var error = req.query.error;
    console.log(access_token);

    res.redirect(301, '/Account');
    res.end();

});

app.get('/Account', function(req, res)
{
    console.log("We've come to account");
    //Connect to database
    pool.connect(config, function (err) 
    {
        console.log("We've connected");
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select * from Account', function (err, recordset) 
        {
            console.log("Trying query");
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            
        });
    });

    sql.on('error', err => {
        console.log(err);
    })
});

var server = app.listen(5000, function () 
{
    console.log('Server is running..');
});