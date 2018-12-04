var db = require('./db')
var express = require('express')
var fs = require('fs')
const { google } = require('googleapis')

var app = express()
//https://github.com/googleapis/google-api-nodejs-client

var authContent = fs.readFileSync('authorisation/client_auth.json')
var jsonAuthContent = JSON.parse(authContent)

const oauth2Client = new google.auth.OAuth2(
  jsonAuthContent.web.client_id,
  jsonAuthContent.web.client_secret,
  jsonAuthContent.web.redirect_uris
)

const scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
]

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
})

oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in my database!
    console.log(tokens.refresh_token);
  }
  console.log(tokens.access_token);
});

app.get('/', function (req, res) {
  res.redirect(301, url)
  res.end()
})

//Code for OAuth2-authorization
app.get('/auth/google/callback', function (req, res) {
  var authCode = req.query.code
  var error = req.query.error

  if (authCode != null) {
    const { tokens } = oauth2Client.getToken(authCode)
    oauth2Client.setCredentials(tokens)
  } else { console.log(error) }

  res.redirect(301, '/Account')
  res.end()
})

app.get('/Account', function (req, res) {
  var request = new db.Request()

  // query to the database and get the records
  request.query('select * from Account', function (err, result) {
    if (err) { console.log(err); res.send(err.message) }

    // send records as a response
    if (result != null) {
      var data = {}
      data['user'] = result.recordset
      res.send(data)
    } else { res.send('\nNo data to show!') }
  })
})

var server = app.listen(5000, function () {
  console.log('Server is running..')
})