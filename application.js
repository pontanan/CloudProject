//GUIDES FOR USE//
//////////////////
//https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request/
//https://stackoverflow.com/questions/45174857/how-to-redirect-to-post-request-in-express
//https://auth0.com/docs/api-auth/tutorials/authorization-code-grant
//https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
//https://www.scottbrady91.com/OpenID-Connect/Getting-Started-with-oidc-provider#disco
//////////////////
const db = require('./db')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var authContent = fs.readFileSync('authorisation/client_auth.json')
var authConfig = JSON.parse(authContent)
const client_id = authConfig.web.client_id
const client_secret = authConfig.web.client_secret
const redirect_uri = authConfig.web.redirect_uris
const auth_uri = authConfig.web.auth_uri
const token_uri = authConfig.web.token_uri

///////////////////////////////////////////////////////////
//CURRENT STATUS: FUNCTIONING -> WORKS TO A CERTAIN POINT//
///////////////////////////////////////////////////////////

//Authentication URL
var authUrl = `${auth_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=token&scope=openid`

  app.get('/', function (req, res) {
    
  })

  //Login
  //Redirects to google authentication
  app.get('/login', function (req, res) {
    res.redirect(301, authUrl)
    res.end()
  })

  //Google-auth callback
  //gets authentication code from google
  app.get('/auth/google/callback', function (req, res) {
    const authCode = req.query.code

    //Needs to be put as a POST towards TOKEN_URI
    var tokenUrl = `${token_uri}?code=${authCode}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=http://localhost:5000/token/google/callback&grant_type=authorization_code`
    console.log(tokenUrl)
    
    res.redirect(307, tokenUrl)
  })

  //posting auth code for token_id
  //Needs to be made so that the authorization code can be posted to TOKEN_URI, to get token_id
  app.post('/token/google/callback', function (req, res) {
    var tokenId = req.query.id_token
    console.log(tokenId)

    res.redirect(301, '/Account')
  })

  app.get('/Account', function (req, res) {
    res.send('It worked!')
  })

  //Server listener
  app.listen(5000, function () {
    console.log('Server Running...')
  });