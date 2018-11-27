const express = require('express');
const bodyParser = require('body-parser');
const sql = require("mssql");

const app = express();
app.use(bodyParser.json());

const config = {
    user: 'CityForumDBAdmin',
    password: 'cloudService123',
    server: 'cityforumdatabase.c7xajpqu6x8l.eu-west-1.rds.amazonaws.com',
    database: 'cityforumDB'
};

// Get all posts
app.get('/posts', function(request,response){

    sql.connect(config, function(error){
        if(error) response.status(500).json(error);
        //create Request object
        var sqlRequest = new sql.Request();

        //query to database to get all posts
        sqlRequest.query('SELECT * FROM Post', function(error, recordset){
            if(error) console.log(error)
            else response.status(200).json(recordset)
        })
    });
});
// Get post
app.get('/posts/:id',function(request,response){

    // get the id from the uri
    const id = parseInt(request.params.id);

    sql.connect(config, function(error){
        if(error) response.status(500).json(error);

        var sqlRequest = new sql.Request();

        // set parameter for query
        sqlRequest.input('Id',sql.Int, id);

        sqlRequest.query("SELECT * FROM Post WHERE ID = @Id", function (error, recordset){
            if(error) response.status(400).json('bad request');
            else response.status(200).json(recordset.recordset[0]);         
        })
    });
}); 

// Create post
app.post('/posts', function(request,response){

    const content = request.body.content;
    const like = request.body.likeCount;
    const dislike = request.body.dislikeCount;
    const time = request.body.time;
    const uid = request.body.userid;

    sql.connect(config, function(error){
        if(error) response.status(500).json(error);

        var sqlRequest = new sql.Request();

        //check if content is not an empty string
        if(content == ""){ response.status(400).json('bad request'); return; }

        sqlRequest.input('Uid',sql.Int, uid);
        sqlRequest.input('Content',sql.Text,content);
        sqlRequest.input('Like',sql.Int,like);
        sqlRequest.input('Dislike',sql.Int, dislike);
        sqlRequest.input('Time',sql.Int, time);
  
        sqlRequest.query("INSERT INTO Post VALUES (@Content, @Like , @Dislike, @Time, @Uid); SELECT SCOPE_IDENTITY() as ID", function (error, recordset) {
        
        if (error) console.log(error);
        response.status(201).json('Location: posts/' + recordset.recordset[0].ID);
        });   
    });        
});

// Delete post
app.delete('/posts/:id',function(request,response){

    const id = parseInt(request.params.id);
    sql.connect(config, function(error){
        if(error) response.status(500).json(error);

        var sqlRequest = new sql.Request();

        sqlRequest.input('Id',sql.Int, id);

        sqlRequest.query("DELETE FROM Post WHERE ID = @Id", function (error, recordset){
            if(error) response.status(400).json('bad request')
            else response.status(204).json(id)
        })
    });
});
// Get user
app.get('/users/:id', function(request,response){

    const id = parseInt(request.params.id);

    sql.connect(config, function(error){
        if(error) response.status(500).json(error);

        var sqlRequest = new sql.Request();

        sqlRequest.input('Id',sql.Int, id);

        sqlRequest.query("SELECT * FROM Account WHERE ID = @Id", function(error, recordset){
            if(error) response.status(400).json('bad request')
            else response.status(200).json(recordset)
        });
    });
})

// Create user
app.post('/users', function(request, response){

    const username = request.body.username;
    const password = request.body.password;
    const email = request.body.email;

    sql.connect(config, function(error){
        if(error) response.status(500).json(error);

        var sqlRequest = new sql.Request();
 
        sqlRequest.input('Username', sql.VarChar, username);
        sqlRequest.input('Password',sql.VarChar,password);
        sqlRequest.input('Email', sql.VarChar, email); 

        sqlRequest.query("INSERT INTO Account (Name, Password, Email) VALUES (@Username, @Password, @Email); SELECT SCOPE_IDENTITY() as ID", function (error, recordset) {
            if(error) response.status(400).json('email or username already exist');
            else response.status(201).json(recordset);          
        });
    });
});  
// Update user
app.put('/users/:id', function(request, response){

    const id = parseInt(request.params.id);
    const description = request.body.description;

    sql.connect(config, function(error){
        if(error) response.status(500).json(error);

        var sqlRequest = new sql.Request();

        sqlRequest.input('Id', sql.Int, id);
        sqlRequest.input('Description', sql.Text, description)

        sqlRequest.query("UPDATE Account SET Description = @Description WHERE ID = @Id ", function(error, recordset){
            if(error) response.status(400).json('bad request');
            else response.status(200).json('user updated');
      });
    });
})
// Delete user
app.delete('/users/:id', function(request,response){

    const id = parseInt(request.params.id);

    sql.connect(config, function(error){
        if(error) response.status(500).json(error);

        var sqlRequest = new sql.Request();

        sqlRequest.input('Id',sql.Int, id);

        sqlRequest.query("DELETE FROM Account WHERE ID = @Id", function (error, recordset){
            if(error) response.status(400).json(error)

            else response.status(204).json('user deleted')
        })
    });
});

// Create Comment

/* TODO 
- Fix proper error messages
*/

app.listen(8000);




