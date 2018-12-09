const db = require('./db')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var jwtSecret = 'This is test'

//login page
//Checks user, hashed passwords and adds JWT token
app.post('/login', function (req, res) {
  const username = req.body.username
  const password = req.body.password

  if(username == "" || username == null) { res.status(422).json('username can not be an empty string'); return; }
  if(password == "" || password == null) { res.status(422).json('password can not be an empty string'); return; }

  var sqlRequest = new db.Request();
  sqlRequest.input('Username', db.VarChar, username);

  sqlRequest.query('SELECT * FROM Account WHERE Name = @Username', function (error, result) {
    try{
      var hash = result.recordset[0].Password
      
      if(bcrypt.compareSync(password, hash)){
        var token = jwt.sign(req.body, jwtSecret);
        res.status(201).send({accessToken: token});
      } else {
        return res.status(400).send({errors: ['Invalid Username or Password']})
      }
    } catch(err) {
      return res.send('ERROR: Unkown')
    }

  })
})


//TEST
//Add 'authorize' to authorize page
//Example: app.get('/users', authorize, function (request, response) {})
app.get('/test', authorize, function (req, res) {
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


//Authorization function
//Checks header for authcode, verifies token and continues if no problem is found
function authorize(req, res, next) {
  if(req.headers['authorization']) {
    try{
      var authorization = req.headers['authorization'].split(' ')
      if(authorization[0] !== 'Bearer'){
        return res.status(401).send()
      } else {
        req.jwt = jwt.verify(authorization[1], jwtSecret)
        return next()
      }
    } catch(err){
      return res.status(403).send()
    }
  } else {
    return res.status(401).send()
  }
}

//Server listener
app.listen(5000, function () {
  console.log('Server Running...')
})
