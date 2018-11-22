var server = require("server");
var express = require('express');
var fs = require("fs");
const {google} = require('googleapis');

var app = express();

var authContent = fs.readFileSync("authorisation/client_auth.json");
var jsonAuthContent = JSON.parse(authContent);

const oauth2Client = new google.auth.OAuth2(
    jsonAuthContent.web.client_id,
    jsonAuthContent.web.client_secret,
    jsonAuthContent.web.redirect_uris
);

    //https://stackoverflow.com/questions/43345149/error-global-connection-already-exists-call-sql-close-first/43345466

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

app.get('/', function(req, res) 
{
    // Connect to database
    

    res.redirect(301, url)
    res.end();

});

app.get('/auth', function(req, res) 
{

    var authCode = req.query.code;
    var error = req.query.error;
    
    if(authCode != null)
    {
        const {tokens} = oauth2Client.getToken(authCode);
        oauth2Client.setCredentials(tokens);
    }
    else{console.log(error);}

    res.redirect(301, '/Account');
    res.end();

});

app.get('/Account', function(req, res)
{
    console.log("We've come to account");
    var request = new server.request();
           
    // query to the database and get the records
    request.query('select * from Account', function (err, recordset) 
    {
        console.log("Trying query");
        if (err) console.log(err)

        // send records as a response
        res.send(recordset);
        console.log("query sent");
            
    });
});

var server = app.listen(5000, function () 
{
    console.log('Server is running..');
});