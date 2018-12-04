const db = require('./db')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const { Issuer } = require('openid-client')

var app = express()

var authContent = fs.readFileSync('authorisation/client_auth.json')
var jsonAuthContent = JSON.parse(authContent)
//https://resources.infosecinstitute.com/securing-web-apis-part-ii-creating-an-api-authenticated-with-oauth-2-in-node-js/#gref
//https://www.scottbrady91.com/OpenID-Connect/Getting-Started-with-oidc-provider

Issuer.discover('https://accounts.google.com')
  .then(function (googleIssuer) {
    console.log('Discovered issuer %s %O', googleIssuer.issuer, googleIssuer.metadata)
  })

const client = new googleIssuer.client({
  client_id: jsonAuthContent.web.client_id,
  client_secret: jsonAuthContent.web.client_secret
}, [keystore])

client.authorizationUrl({
  redirect_uri: jsonAuthContent.web.redirect_uri,
  scope: 'openid email'
})

const { state, response_type } = session[authorizationRequestState]
client.authorizationCallback('https://localhost:5000/callback')

const tokenObject = {
  'access_token': '<access-token>',
  'refresh_token': '<refresh-token>',
  'expires_in': '7200'
}

const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'http://localhost:5000/callback',
  scope: 'notifications',
  state: '3(#0/!~',
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with Github</a>');
});

app.get('/auth', (req, res) => {
  console.log(authorizationUri)
  res.redirect(authorizationUri)
});

//Code for OAuth2-authorization
app.get('/callback', async (req, res) => {
  const code = req.query.code
  const options = {
    code,
  }

  try {
    const result = await oauth2.ownerPassword.getToken(tokenConfig)
    console.log('The resulting token: ', result);
    const accessToken = oauth2.accessToken.create(result)
    return res.status(200).json(token)
  } catch (error) {
    console.log('Access Token Error', error.message)
    return res.status(500).json('Authentication failed');
  }
  res.redirect(301, '/Account')
  res.end()
})

app.get('/login', (req, res) => {
  res.redirect(301, url)
  res.end()
})

app.post('/login', (req, res) => {
  console.log(req.body)
  res.send('Posted onto login')
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

  oauth2Client
})

var server = app.listen(5000, function () {
  console.log('Server is running..')
})
