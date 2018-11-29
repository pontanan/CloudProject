var db = require('./db')
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// regex to check numbers
const numRegex = new RegExp('^[0-9]+$');

// GET /posts
app.get('/posts', function(request,response){

        //create Request object
        var sqlRequest = new db.Request()

        //query to database to get all posts
        sqlRequest.query('SELECT * FROM Post', function(error, result){
            if(error){ 
                console.log(error);
                console.log(error.number);
                response.status(500).end();
            } 
            else response.status(200).json(result);
        })
});

// GET /posts/id
// uri: id = 3
app.get('/posts/:id',function(request,response){

    // get the id from the uri
    const id = parseInt(request.params.id);
    // if id is not a number
    if(!(numRegex.test(id))) { response.status(400).json('id can not contain letters'); return; }

    var sqlRequest = new db.Request();

    // set parameter for query
    sqlRequest.input('Id', db.Int, id);

    sqlRequest.query("SELECT * FROM Post WHERE ID = @Id", function (error, result){ 
        if(error){ 
            console.log(error);
            console.log(error.number);
            response.status(500).end(); 
            return; 
        }
        // database or server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(400).json('post does not exist'); return; }     
        if(result.recordset.length == 0){ response.status(400).json('post does not exist'); return; }
        response.status(200).json(result.recordset[0]);         
    })
}); 

// POST /posts
// Body: { "content": "some text", "likeCount": 4, "dislikeCount": 2, "time": 43242425, "userid": 3}
app.post('/posts', function(request,response){

    var content = request.body.content;
    var like = request.body.likeCount;
    var dislike = request.body.dislikeCount;
    var time = request.body.time;
    var uid = request.body.userid;

    if(!(numRegex.test(uid))) { response.status(400).json('id can not contain letters')}

    // if content is not an empty string
    if(content == ""){ response.status(400).json('content can not be an empty string'); return; }

    // if time is not a number
    if(!(numRegex.test(time))) { response.status(400).json('Time is not a number'); return; }
     // if like and dislike is empty or does not contain numbers, set their default to 0
    if(!(numRegex.test(like))) like = 0
    if(!(numRegex.test(dislike))) dislike = 0

        var sqlRequest = new db.Request();

        sqlRequest.input('Uid',db.Int, uid);
        sqlRequest.input('Content',db.Text,content);
        sqlRequest.input('Like',db.Int,like);
        sqlRequest.input('Dislike',db.Int, dislike);
        sqlRequest.input('Time',db.Text, time);
  
        sqlRequest.query("INSERT INTO Post VALUES (@Content, @Like , @Dislike, @Uid, @Time); SELECT SCOPE_IDENTITY() as ID", function (error, result) {
        
        if (error){
            if(error.number == 547) response.status(400).json('user does not exist')
            else response.status(500)
            return;
        } 
        // database or server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(400).json('server connection failed'); return; }     
        response.status(201).json('Location: posts/' + result.recordset[0].ID);
        });        
});

// DELETE /posts/:id
// uri: id = 3
app.delete('/posts/:id',function(request,response){

    const id = parseInt(request.params.id);
    
    if(!(numRegex.test(id))){ response.status(400).json('id can not contain letters'); return; }

    var sqlRequest = new db.Request();
    sqlRequest.input('Id',db.Int, id);

    sqlRequest.query("DELETE FROM Post WHERE ID = @Id", function (error, result){   
        if(error){ response.status(500).end(); return; }  
        // database or server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(400).json('post does not exist !!'); return; }      
        if (result.rowsAffected == 0) { response.status(400).json('post does not exist'); return; }
        else response.status(204).json(id)
    })
});
// GET /users/:id
// uri: id = 3
app.get('/users/:id', function(request,response){

    const id = parseInt(request.params.id);

    if(!(numRegex.test(id))){ response.status(400).json('id can not contain letters'); return; }

    var sqlRequest = new db.Request();
    sqlRequest.input('Id',db.Int, id);

    sqlRequest.query("SELECT * FROM Account WHERE ID = @Id", function(error, result){
        if(error){ response.status(500).end();return; }
        // database or server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(400).json('user does not exist !!'); return; }   
        if(result.recordset.length == 0) { response.status(400).json('user does not exist'); return; }
        response.status(200).json(result.recordset[0]);
    });
})

// POST /users
// Body: { "username": "Alice", "password": "3423dfs4354", "email": "alice@gmail.com" }
app.post('/users', function(request, response){

    const username = request.body.username;
    const password = request.body.password;
    const email = request.body.email;

    // if input are empty 
    if(username == "") { response.status(400).json('username can not be an empty string'); return; }
    if(password == "") { response.status(400).json('password can not be an empty string'); return; }
    if(email == "") { response.status(400).json('email can not be an empty string'); return; }

    var sqlRequest = new db.Request();
    sqlRequest.input('Username', db.VarChar, username);
    sqlRequest.input('Password',db.VarChar,password);
    sqlRequest.input('Email', db.VarChar, email); 

    sqlRequest.query("INSERT INTO Account (Name, Password, Email) VALUES (@Username, @Password, @Email); SELECT SCOPE_IDENTITY() as ID", function (error, result) {
        if(error){
            if(error.number == 2627) response.status(400).json('email or username already exist');
            else response.status(500).end()
            return;
        }
        response.status(201).json('Location: users/' + result.recordset[0].ID);      
    });
});  
// PUT /users/:id
// uri: id = 3
// Body: { "description": "some text"}
app.put('/users/:id', function(request, response){

    const id = parseInt(request.params.id);
    const description = request.body.description;

    if(!(numRegex.test(id))){ response.status(400).json('id can not contain letters'); return; }
    if(description == ""){ response.status(400).json('description is empty'); return; }

        var sqlRequest = new db.Request();
        sqlRequest.input('Id', db.Int, id);
        sqlRequest.input('Description', db.Text, description)

        sqlRequest.query("UPDATE Account SET Description = @Description WHERE ID = @Id ", function(error, result){
            if(error) { response.status(500).end(); return; } 
            // database or server is fuckedup and sometimes result is undefined   
            if(!result) { response.status(400).json('user does not exist !!'); return; }
            if(result.rowsAffected == 0) {response.status(400).json('user does not exist'); return; }
            response.status(200).json('user updated');
      });
});
// Delete user
app.delete('/users/:id', function(request,response){

    const id = parseInt(request.params.id);
    if(!(numRegex.test(id))){ response.status(400).json('id can not contain letters'); return; }

        var sqlRequest = new db.Request();
        sqlRequest.input('Id',db.Int, id);

        sqlRequest.query("DELETE FROM Account WHERE ID = @Id", function (error, result){
            if (error) {
                console.log(error.number);
                console.log(error);
                response.status(500).json(error);
                return; 
            } 
            // database or server is fuckedup and sometimes result is undefined   
            if(!result) { response.status(400).json('user does not exist !!'); return; }
            if (result.rowsAffected == 0) { response.status(400).json('user does not exist'); return; }
            response.status(204).json('user deleted')
        })
});

// Create Comment
// Body: { "number": 1, "content": "some text", "likeCount": 40, "dislikeCount": 10, "time": 343242, "userid": 3, "postid": 4 }
app.post('/comments', function(request,response){
    console.log('hej');
    
    var content = request.body.content;
    var like = request.body.likeCount;
    var dislike = request.body.dislikeCount;
    var time = request.body.time;
    var pid = request.body.postid;
    var uid = request.body.userid;

    // if input is not valid
    if(content == "") { response.status(400).json('content can not be an empty string'); return; }
    if(!(numRegex.test(time))) { response.status(400).json('time can not contain letters'); return; }
    if(!(numRegex.test(uid))) { response.status(400).json('userid can not contain letters'); return; }
    if(!(numRegex.test(pid))) { response.status(400).json('postid can not contain letters'); return; }
    // set default value 0 to time of not valid
    if(!(numRegex.test(like))) like = 0
    if(!(numRegex.test(dislike))) dislike = 0

    var sqlRequest = new db.Request();
/*
    sqlRequest.input('Content',db.Text, content);
    sqlRequest.input('Like', db.Int, like);
    sqlRequest.input('Dislike', db.Int, dislike);
    sqlRequest.input('Time', db.text, time);
    sqlRequest.input('Pid', db.Int, pid);
    sqlRequest.input('Uid', sql.Int, uid);
*/
        // check if user exist before posting comment to database
        /*sqlRequest.query("SELECT Name FROM Account WHERE ID = @Uid", function(error,result){
            if(error){ 
                console.log(error.number);
                response.status(500).end(); 
            }
            // database or server is fuckedup and sometimes result is undefined   
            if(!result) { response.status(400).json('user does not exist !!'); return; }   
            if(result.recordset.length == 0) { response.status(400).json('user does not exist'); return; }
            console.log(result);
        });*/
        sqlRequest.query("INSERT INTO Comment (LikeCount, DislikeCount, Content, Time, PID, Username) VALUES ('4', '3', 'gfdgdg', '543535', '29', 'Alice'); SELECT SCOPE_IDENTITY() as ID", function(error, result){
            
            if(error) {
                if(error.number == 547) response.status(400).json('userid or postid does not exist');
                else response.status(500).end();  
                return;
            }
            // database or server is fuckedup and sometimes result is undefined   
            if(!result) { response.status(400).json('userid or postid does not exist !!'); return; }          
            response.status(201).json('Location: /comments/' + result.recordset[0].ID)
        });
}); 
/* TODO 
- Fix proper error messages
*/

app.listen(8000);




