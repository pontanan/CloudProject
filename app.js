var db = require('./db')
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// GET /posts
app.get('/posts', function(request,response){

        //create Request object
        var sqlRequest = new db.Request()

        //query to database to get all posts
        sqlRequest.query('SELECT * FROM Post', function(error, result){
            if(error) response.status(500).end();
            else response.status(200).json(result);
        })
});

// GET /posts/id
// uri: id = 3
app.get('/posts/:id',function(request,response){

    // get the id from the uri
    const id = parseInt(request.params.id);

    var sqlRequest = new db.Request();

    // set parameter for query
    sqlRequest.input('Id', db.Int, id);

    sqlRequest.query("SELECT * FROM Post WHERE ID = @Id", function (error, result){
        if(result.recordset.length == 0){
            response.status(400).json('post does not exist');
        }
        else if(error) response.status(500).end();
        else response.status(200).json(result.recordset[0]);         
    })
}); 

// POST /posts
// Body: { "content": "some text", "likeCount": 4, "dislikeCount": 2, "time": 43242425, "userid": 3}
app.post('/posts', function(request,response){

    const content = request.body.content;
    var like = request.body.likeCount;
    const dislike = request.body.dislikeCount;
    const time = request.body.time;
    const uid = request.body.userid;

    // if content is not an empty string
    if(content == ""){ response.status(400).json('Content cant be an empty string'); return; }
   // regex to check numbers
    var reg = new RegExp('^[0-9]+$');
    // if time is not a number
    if(!(reg.test(time))) { response.status(400).json('Time is not a number'); return; }
     // if like and dislike is empty or does not contain numbers, set their default to 0
    if(!(reg.test(like))) like = 0
    if(!(reg.test(dislike))) dislike = 0

        var sqlRequest = new db.Request();

        sqlRequest.input('Uid',db.Int, uid);
        sqlRequest.input('Content',db.Text,content);
        sqlRequest.input('Like',db.Int,like);
        sqlRequest.input('Dislike',db.Int, dislike);
        sqlRequest.input('Time',db.Int, time);
  
        sqlRequest.query("INSERT INTO Post VALUES (@Content, @Like , @Dislike, @Time, @Uid); SELECT SCOPE_IDENTITY() as ID", function (error, result) {
        
        if (error){
            // check if Uid is a real user
            if(error.number == 547) response.status(400).json('user does not exist')
            else response.status(500)
        } 
        else response.status(201).json('Location: posts/' + result.recordset[0].ID);
        });        
});
/*
// DELETE /posts/:id
// uri: id = 3
app.delete('/posts/:id',function(request,response){

    const id = parseInt(request.params.id);
    sql.connect(config, function(error){
        if(error) response.status(500).json(error);

        var sqlRequest = new sql.Request();

        sqlRequest.input('Id',sql.Int, id);

        sqlRequest.query("DELETE FROM Post WHERE ID = @Id", function (error, result){        
            if(error) response.status(400).json('bad request')
            else response.status(204).json(id)
        })
    });
});
// GET /users/:id
// uri: id = 3
app.get('/users/:id', function(request,response){

    const id = parseInt(request.params.id);

    sql.connect(config, function(error){
        if(error) response.status(500).json(error);

        var sqlRequest = new sql.Request();

        sqlRequest.input('Id',sql.Int, id);

        sqlRequest.query("SELECT * FROM Account WHERE ID = @Id", function(error, result){
            if(result.recordset[0] == null) response.status(400).json('user does not exist');            
            else if(error) response.status(400).json('bad request');
            else response.status(200).json(result.recordset[0]);
        });
    });
})

// POST /users
// Body: { "username": "Alice", "password": "3423dfs4354", "email": "alice@gmail.com" }
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

        sqlRequest.query("INSERT INTO Account (Name, Password, Email) VALUES (@Username, @Password, @Email); SELECT SCOPE_IDENTITY() as ID", function (error, result) {

            if(error){
                if(error.number == 2627) response.status(400).json('email or username already exist');
                else response.status(500).end()
            }
            else response.status(201).json('Location: users/' + result.recordset[0].ID);      
        });
    });
});  
// PUT /users/:id
// uri: id = 3
// Body: { "description": "some text"}
app.put('/users/:id', function(request, response){

    const id = parseInt(request.params.id);
    const description = request.body.description;

    sql.connect(config, function(error){
        if(error) response.status(500).json(error);

        var sqlRequest = new sql.Request();
        sqlRequest.input('Id', sql.Int, id);
        sqlRequest.input('Description', sql.Text, description)

        sqlRequest.query("UPDATE Account SET Description = @Description WHERE ID = @Id ", function(error, result){
            if(result.recordset == null) response.status(400).json('user does not exist');
            else if(error) response.status(500).end();
            else response.status(200).json('user updated');
      });
    });
});
// Delete user
app.delete('/users/:id', function(request,response){

    const id = parseInt(request.params.id);

    sql.connect(config, function(error){
        if(error) response.json(error);

        var sqlRequest = new sql.Request();
        sqlRequest.input('Id',sql.Int, id);

        sqlRequest.query("DELETE FROM Account WHERE ID = @Id", function (error, result){
            if(error) response.status(500).json(error)
            else response.status(204).json('user deleted')
        })
    });
});

// Create Comment
// Body: { "number": 1, "content": "some text", "likeCount": 40, "dislikeCount": 10, "time": 343242, "userid": 3, "postid": 4 }
app.post('/comments', function(request,response){

    var number = request.body.number;
    var content = request.body.content;
    var like = request.body.likeCount;
    var dislike = request.body.dislikeCount;
    var time = request.body.time;
    var uid = request.body.userid;
    var pid = request.body.postid;

    if(content == "") {
        response.json('Content cant be an empty string');
        return;
    }

    sql.connect(config,function(error){
        if(error) response.json(error);

        var sqlRequest = new sql.Request();

        sqlRequest.input('Content',sql.Int, content);
        sqlRequest.input('Like', sql.Int, like);
        sqlRequest.input('Dislike', sql.Int, dislike);
        sqlRequest.input('Time', sql.Int, time);
        sqlRequest.input('Uid', Sql.Int, uid);
        sqlRequest.input('Pid', sql.Int, pid);

        sql.query("INSERT INTO Comment (LikeCount, DislikeCount, Content, Time, PID, UID) VALUES (@Like, @Dislike, @Content, @Time, @Pid, @Uid); SELECT SCOPE_IDENTITY() as ID", function(error, result){
            //Check if post exist, user exist
            if(result.recordset[0] == null) response.status(400).json('post or userid does not exist');
            else if(error) response.status(400).json('bad request')
            else response.status(201).json(result.recordset[0].ID)
        });
    });
}); */
/* TODO 
- Fix proper error messages
*/

app.listen(8000);




