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
/*const db = require('./db')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const request = require('request')
const { OAuth2Client } = require('google-auth-library')

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
var JWTSecret = 'whathasthis589ff'


/////////////////////////////////////////////////////////////////////////////////
///CURRENT STATUS: FUNCTIONING -> WORKS AS FAR AS GETTING GOOGLE_USER_ID (SUB)///
/////////////////////////////////////////////////////////////////////////////////
//Start with http://localhost:5000/login

//Token Verification Client
const client = new OAuth2Client(client_id)

//Authentication URL
var authUrl = `${auth_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=openid`

app.get('/', function (req, res) {
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

//Login
//Redirects to google authentication
/*app.get('/createToken', function (req, res) {

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

app.get('/login', function (req, res) {

  res.redirect(301, authUrl)
  res.end()
})

//Google-auth callback
//gets authentication code from google
app.get('/auth/google/callback', function (req, res) {
  var authCode = req.query.code
  var id = 15; //TODO: Get a way to find the id

  tokenUrl = `${token_uri}?code=${authCode}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&grant_type=authorization_code`

  var sqlRequest = new db.Request();

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

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: body.id_token,
        audience: client_id
      })
      const payload = ticket.getPayload()
      const userid = payload['sub']

      sqlRequest.input('Id', db.Int, id);
      sqlRequest.input('Google_id', db.Text, userid)


      //TODO: make so google_id can be saved
      sqlRequest.query("UPDATE Account SET google_id = @Google_id WHERE ID = @Id ", function(error, result){
        if(error) { res.status(500).json(error); return; }   
        if(!result) { res.status(400).json('user does not exist !!'); return; }
        if(result.rowsAffected == 0) {res.status(400).json('user does not exist'); return; }
        res.status(200).redirect(301, '/Account')
      });
    }
    verify().catch(console.error)
  })
})

app.get('/Account', function (req, res) {
  res.send('It worked!')
})

//Server listener
app.listen(5000, function () {
  console.log('Server Running...')
})*/