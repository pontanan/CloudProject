//Sources
//https://github.com/googleapis/google-api-nodejs-client

var db = require('./db')
var express = require('express')
var fs = require('fs')
const { google } = require('googleapis')

//OLD VERSION, ONLY DOES GOOGLE AUTHENTICATION WITH OAUTH2.0
var app = express()

var authContent = fs.readFileSync('authorisation/client_auth.json')
var jsonAuthContent = JSON.parse(authContent)

const oauth2Client = new google.auth.OAuth2(
  jsonAuthContent.web.client_id,
  jsonAuthContent.web.client_secret,
  jsonAuthContent.web.redirect_uris
)

const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=907310423522-jeltf2brm30cidh0nvgiooqu2suq59uj.apps.googleusercontent.com&redirect_uri=http://localhost:5000/auth/google/callback&response_type=code&scope=openid'
var authCode = ''
const tokenUrl = 'https://accounts.google.com/o/oauth2/v4/token?code=4/qQB_Z8n9-vWr-fKlxX4E55BwHMfClfC03YkBUgUcxOjl1VG_BSOEJAhDHxdDY87S53SDL9yspPo6EsNEtGpsNwY&client_id=907310423522-jeltf2brm30cidh0nvgiooqu2suq59uj.apps.googleusercontent.com&client_secret=l41DuithJ-LkXTUqnVnTZull&redirect_uri=http://localhost:5000/auth/google/callback&grant_type=authorization_code'
var tokenID = ''


app.get('/', function (req, res) {
  res.redirect(301, authUrl)
  res.end()
})

//Code for OAuth2-authorization
app.get('/auth/google/callback', function (req, res) {
  if(tokenID == '') {
    authCode = req.query.code
    console.log('Auth Code: %s', authCode)

    res.redirect(301, tokenUrl)
    res.end()
  } else { 
    tokenID = req.query.id_token
    console.log('ID Token: %s', tokenID)

    res.redirect(301, '/Account')
    res.end() 
  }
})

app.post('/token/google/callback', function (req, res) {

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