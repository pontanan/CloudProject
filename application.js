//SOURCES USED - WITH BE USED//
//////////////////
//https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request/
//https://stackoverflow.com/questions/45174857/how-to-redirect-to-post-request-in-express
//https://auth0.com/docs/api-auth/tutorials/authorization-code-grant
//https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
//https://www.scottbrady91.com/OpenID-Connect/Getting-Started-with-oidc-provider#disco
//https://auth0.com/docs/tokens/id-token
//https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52
//////////////////
const db = require('./db')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const request = require('request')
const { OAuth2Client } = require('google-auth-library')
const session = require('express-session')

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
var JWTSecret = 'whathasthis589ff' //Might not be used


////////////////////////////////////////////////////////////////////////////////
///CURRENT STATUS: FUNCTIONING -> WORKS AS FAR AS SAVING GOOGLE_USER_ID (SUB)///
////////////////////////////////////////////////////////////////////////////////
//Start with http://localhost:5000/login

//Token Verification Client
const client = new OAuth2Client(client_id)

//Session
app.use(session( { 
  secret: 'testsecret', 
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 36000000 }
}))

//Authentication URL
var authUrl = `${auth_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=openid`

app.get('/', isAuthenticated, function (req, res) {
  if(req.session.authenticated = 1)
    req.session.authenticated = null
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

/*app.post('/register', function () {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8)
})*/

//Login -> FOR TESTING
//Redirects to google authentication
app.get('/createToken', function (req, res) {

  const uId = 15
  
  var token = jwt.sign({ id: uId }, JWTSecret, {
    expiresIn: 86400 //24 hours
  })

  res.status(200).send({ token: token });
})

app.get('/me', function(req, res) {
  var token = req.headers['x-access-token'];
  var sqlRequest = new db.Request();

  if (!token) return res.status(401).send({ message: 'No token provided.' });
  
  jwt.verify(token, JWTSecret, function(err, decoded) {
    if (err) return res.status(500).send({ message: 'Failed to authenticate token.' });

    var id = decoded.id
    console.log(id)

    sqlRequest.input('Id',db.Int, id);

    sqlRequest.query("SELECT * FROM Account WHERE ID = @Id", function(error, result){
        if(error){ res.status(500).json(error); return; }
        if(!result) { res.status(400).json('user does not exist !!'); return; }   
        if(result.recordset.length == 0) { res.status(400).json('user does not exist'); return; }
        res.status(200).json(result.recordset[0]);
    });
  });
});

//TODO: Make sure authentication runs before anything
//app.all('*', authenticate)

app.get('/login', function (req, res) {

  res.redirect(301, authUrl)
  res.end()
})

//Google-auth callback
//gets authentication code from google
app.get('/auth/google/callback', function (req, res) {
  var authCode = req.query.code

  tokenUrl = `${token_uri}?code=${authCode}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&grant_type=authorization_code`

  //Posting request settings
  var options = { method: 'POST',
    url: token_uri,
    headers: { 'content-type': 'application/json'},
    body: {
      grant_type: 'authorization_code',
      client_id: client_id,
      client_secret: client_secret,
      code: authCode,
      redirect_uri: 'http://localhost:5000/auth/google/callback' },
    json: true }

  //Posting auth_code to google to get a id_token
  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    req.session.id_token = body.id_token

    //Verify legitimacy of id_token
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: body.id_token,
        audience: client_id
      })
      const payload = ticket.getPayload()

      req.session.google_id = payload['sub'] //Save id_token in session
      console.log(req.session.google_id)
      console.log(req.session.redirectUrl)

      //If directly from /login, else from other uri as authentication
      if(req.session.redirectUrl == null) { res.redirect('/') }
      else { 
        var url = req.session.redirectUrl
        req.session.redirectUrl = null
        console.log('testing')

        req.session.authenticated = 1
        res.redirect(url)
      }
    }
    verify().catch(console.error)
  })
})

//TODO: Make sure app runs through authentication before accessing
app.get('/Account', isAuthenticated, function (req, res) {
  console.log(req.session.authenticated)
  console.log('In account')
  console.log(req.session.authenticated)

  res.send('It worked!')
})

//Server listener
app.listen(5000, function () {
  console.log('Server Running...')
})

//TODO: Make use of function, make so it works
function authenticate(req, res, next) {

  //Check if we have already run through the authentication
  if(req.session.authenticated = 1) {
    return next()
  } else {
    //If google_id does not exist, else redirect to login for authentication
    if(req.session.google_id == null) {
      var err = new Error('You must be logged in to view this page.');
      err.status = 401;
      console.log(err)
      return next(err);
    } else {
      var url = req.url
      req.session.redirectUrl = url

      res.redirect('/login')
    }
  }
}

function isAuthenticated(req, res, next) {
  if(req.session.authenticated = 1){
    req.session.authenticated = null
    return next()
  }
}
