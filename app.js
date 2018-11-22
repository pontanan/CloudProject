const sql = require('mssql');
const express = require('express');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json())

const config = {
    user: 'CityForumDBAdmin',
    password: 'cloudService123',
    server: 'cityforumdatabase.c7xajpqu6x8l.eu-west-1.rds.amazonaws.com',
    database: 'cityforumDB'
};


/* TODO 
- Fix proper error messages
*/

// Get all posts
app.get('/posts', function(request,response){
    sql.connect(config, function(error){

        if(error) console.log(error)
        //create Request object
        var request = new sql.Request();
        //query to database to get all posts
        request.query('SELECT * FROM Post', function(error, recordset){
            if(error) console.log(error)
            else response.status(200).json(recordset)
        })
    });
});
// Get post
app.get('/posts/:id',function(request,response){

    // get the id from the uri
    const id = parseInt(request.params.id);

    sql.connect(config, function (error){

        if (error) console.log(error);

        // create Request object
        var request = new sql.Request();
        // set parameter for query
        request.input('Id',sql.Int, id);

        // query to the database to get the post
        request.query("SELECT * FROM Post WHERE ID = @Id", function (error, recordset){
            if(error) response.status(400).json('bad request')
            else response.status(200).json(recordset)
        })

    });
});
// Add new post
app.post('/posts', function(request,response){

    const content = request.body.content;
    const like = request.body.likeCount;
    const dislike = request.body.dislikeCount;
    const time = request.body.time;
    const uid = request.body.userid;
         
    sql.connect(config, function (error) {
    
        if (error) console.log(error);
        //create Request object
        var request = new sql.Request();

        //check if content is no an empty string
        if(content == ""){ request.status(400).json('bad request'); return; }

        //set parameters for query
        request.input('Uid',sql.Int, uid);
        request.input('Content',sql.Text,content);
        request.input('Like',sql.Int,like);
        request.input('Dislike',sql.Int, dislike);
        request.input('Time',sql.Int, time);
  
        //query to the database to insert new post and get the id 
        request.query("INSERT INTO Post VALUES (@Content, @Like , @Dislike, @Time, @Uid); SELECT SCOPE_IDENTITY() as ID", function (error, recordset) {
        
        if (error) console.log(error);
        //Return statuscode created and the location of the new post
        response.status(201).json(recordset);
        });
    });
});
// Delete post
app.delete('/posts/:id',function(request,response){

    // get the id from the uri
    const id = parseInt(request.params.id);

    sql.connect(config, function (error){

        if (error) console.log(error);

        // create Request object
        var request = new sql.Request();
        // set parameter for query
        request.input('Id',sql.Int, id);
        // query to the database to get the post
        request.query("DELETE FROM Post WHERE ID = @Id", function (error, recordset){
            if(error) response.status(400).json('bad request')
            else response.status(204).json('post deleted')
        })

    });
});
// Create a user
app.post('/users', function(request, response){

    const username = request.body.username;
    const password = request.body.password;
    const email = request.body.email;

    sql.connect(config, function (error) {
    
        if (error) console.log(error);
        console.log(username, password, email)
        // create Request object
        var request = new sql.Request();
        // set parameters for query
        
        request.input('Username', sql.VarChar, username);
        request.input('Password',sql.VarChar,password);
        request.input('Email', sql.VarChar, email); 
        
        // query to the database to add new user and return ID
        request.query("INSERT INTO Account (Name, Password, Email) VALUES (@Username, @Password, @Email); SELECT SCOPE_IDENTITY() as ID", function (error, recordset) {
        if(error) response.status(400).json('email or username already exist')
        else response.status(201).json(recordset)
           
        });
    });
});

app.listen(8000);




