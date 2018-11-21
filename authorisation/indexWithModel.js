/*<--------------Code we've already written:------------------->*/

/* Create the port that we’re connecting to */
const port = 8080

/* Get a connection to the mySql database */
const mySqlConnection = require('./dbHelpers/mySqlWrapper')

/* The bearerTokenDBHelper handles all of the database operations
relating to saving and retrieving oAuth2 bearer tokens */
const bearerTokensDBHelper =
                     require('./dbHelpers/bearerTokensDBHelper')
                                                       (mySqlConnection)


/* The userDBHelper handles all of the database operations relating
to users such as registering and retrieving them */
const userDBHelper =
                require('./dbHelpers/userDBHelper')
                                        (mySqlConnection)

//Require express
const express = require('express')

//Initialise the express app
const expressApp = express()

/*<-------------------Code we're adding PART 1------------------------->*/

/* We require the node-oauth2-server library */
const oAuth2Server = require('node-oauth2-server')

/* Here we instantiate the model we just made and inject the dbHelpers we use in it */
const oAuthModel =
         require('./authorisation/accessTokenModel')
                                             (userDBHelper,
                                                    bearerTokensDBHelper)

/* Now we instantiate the oAuth2Server and pass in an object which tells
the the password library that we're using the password  grant type and
give it the model we just required. */
expressApp.oauth = oAuth2Server({
    model: oAuthModel,
    grants: ['password'],
    debug: true
})

/*<-------------------Code we're adding PART 1------------------------->*/

/* Here we require the authRoutesMethods object from the module
 that we just made */
const authRoutesMethods =
                 require('./authorisation/authRoutesMethods')
                                                    (userDBHelper)

/* Now we instantiate the authRouter module and inject all
of its dependencies. */
const authRouter =
              require('./authorisation/authRouter')
                                              (express.Router(),
                                                          expressApp,
                                                                authRoutesMethods)

/* Here we asign the authRouter as middleware in the express app.
 By doing this all request sent to routes that start with /auth
 will be handled by this router*/
expressApp.use('/auth', authRouter)

/*<-------------------Code we're adding PART 2------------------------->*/

/* Setup the oAuth error handling */
expressApp.use(expressApp.oauth.errorHandler())

/*<-------------------Code we're adding PART 2------------------------->*/

/* Set the bodyParser to parse the urlencoded post data */
expressApp.use(bodyParser.urlencoded({ extended: true }))

/* init the server */
expressApp.listen(port, () => {

    console.log(`listening on port ${port}`)
})

/*<--------------Code we've already written:------------------->*/