var db = require('./db');
const express = require('express');
const bodyParser = require('body-parser');
const fileBucket = require('./fileBucket');

const app = express();
app.use(bodyParser.json());

// Download profile picture
app.get('/images/:id', function(request, response){

    // get the id(picture name) from the uri
    const id = parseInt(request.params.id);

    var params = {
        Bucket: "cityforum-bucket-123", 
        Key: String(id)
    };
    
       fileBucket.s3.getObject(params, function(error, data) {
         if (error) response.json(error);
         else  response.json(data);           
         /*
         data = {
          AcceptRanges: "bytes", 
          ContentLength: 3191, 
          ContentType: "image/jpeg", 
          ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
          LastModified: <Date Representation>, 
          Metadata: {
          }, 
          TagCount: 2, 
          VersionId: "null"
         }
         */
       });
})

// Upload profile picture
// TODO: Set image name as username or userid
  app.post('/images', fileBucket.upload.single('image'), function(request, response, next) {
    response.send('Successfully uploaded ' + request.file)
  })

// regex to check numbers
const numRegex = new RegExp('^[0-9]+$');

// -------------------------------------------------------------------- Posts --------------------------------------------------------------------
// Description: Get a list of all posts
// GET /posts
app.get('/posts', function(request,response){

        //create Request object
        var sqlRequest = new db.Request();

        //query to database to get all posts
        sqlRequest.query('SELECT * FROM Post', function(error, result){
            if(error){ 
                console.log(error);
                console.log(error.number);
                response.status(500).end(); 
                return; 
            }
            else response.status(200).json(result);
        })
});
// Description: Get a specific post
// GET /posts/id
// uri: id of the post
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
// Description: Create a post
// POST /posts
// Body: { "content": "some text", "time": "43242425", "userid": 3}
app.post('/posts', function(request,response){

    var content = request.body.content;
    var time = request.body.time;
    var uid = request.body.userid;

    if(!(numRegex.test(uid))) { response.status(400).json('id can not contain letters')}

    // if content is not an empty string
    if(content == "" || content == null){ response.status(422).json('content can not be an empty string'); return; }
    // if time is not a number or empty
    if(!(numRegex.test(time)) || time == null) { response.status(422).json('time can not contain letters'); return; }

        var sqlRequest = new db.Request();

        sqlRequest.input('Uid',db.Int, uid);
        sqlRequest.input('Content',db.Text,content);
        sqlRequest.input('Time',db.Text, time);
  
        sqlRequest.query("INSERT INTO Post (Content, UID, Time) VALUES (@Content, @Uid, @Time); SELECT SCOPE_IDENTITY() as ID", function (error, result) {
            if (error){
                if(error.number == 547) response.status(400).json('user does not exist' + error);
                else response.status(500).json(error);
                return;
            } 
        // server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(500).json('server connection failed'); return; }     
        response.status(201).json('Location: posts/' + result.recordset[0].ID);
        });        
});
//Description: Update the like and dislike count in a post
// UPDATE /posts/id
// uri: id of the post
// Body: {"like": 3, "dislike": 2}
app.put('/posts/:id', function(request, response){

    const id = parseInt(request.params.id);    
    if(!(numRegex.test(id))){ response.status(400).json('id can not contain letters'); return; }

    var like = request.body.like;
    var dislike = request.body.dislike;

    if(!(numRegex.test(like)) || !(numRegex.test(dislike))) { response.status(422).json('like and dislike can not contain letters'); return; }

    sqlRequest = new db.Request();
    sqlRequest.input('Id', db.Int, id);
    sqlRequest.input('Like', db.Int, like);
    sqlRequest.input('Dislike', db.Int, dislike);


    sqlRequest.query("UPDATE Post SET LikeCount = @Like, DislikeCount = @Dislike WHERE ID = @Id ", function(error, result){
        if(error) {  response.status(500).json(error); return; } 
        // server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(400).json('post does not exist !!'); return; }
        if(result.rowsAffected == 0) {response.status(400).json('post does not exist'); return; }
        response.status(200).json('post updated');

    });
});
// Description: Delete a post
// DELETE /posts/id
// uri: id of the post
app.delete('/posts/:id',function(request,response){

    const id = parseInt(request.params.id);   
    if(!(numRegex.test(id))){ response.status(400).json('id can not contain letters'); return; }

    var sqlRequest = new db.Request();
    sqlRequest.input('Id',db.Int, id);

    sqlRequest.query("DELETE FROM Post WHERE ID = @Id", function (error, result){   
        if(error){ response.status(500).json(error); return; }  
        // server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(400).json('post does not exist !!'); return; }      
        if (result.rowsAffected == 0) { response.status(400).json('post does not exist'); return; }
        else response.status(204).json('post deleted');
    })
});
// -------------------------------------------------------------------- Users --------------------------------------------------------------------
// Description: Get a user
// GET /users/id
// uri: id of the user 
app.get('/users/:id', function(request,response){

    const id = parseInt(request.params.id);
    var sqlRequest = new db.Request();
    console.log(id);

    if(!(numRegex.test(id))){ 
        response.status(400).json('id can not contain letters');
    }
    
    sqlRequest.input('Id',db.Int, id);
    sqlRequest.query("SELECT * FROM Account WHERE ID = @Id", function(error, result){
        if(error){ response.status(500).json(error); return; }
        // database or server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(400).json('user does not exist !!'); return; }   
        if(result.recordset.length == 0) { response.status(400).json('user does not exist'); return; }
        response.status(200).json("name: " + result.recordset[0].Name + " email: " + result.recordset[0].Email + " description: " + result.recordset[0].Description);
    }); 
})
// Description: Create a user
// POST /users
// Body: { "username": "Alice", "password": "3423dfs4354", "email": "alice@gmail.com" }
app.post('/users', function(request, response){

    const username = request.body.username;
    const password = request.body.password;
    const email = request.body.email;

    // if input are empty 
    if(username == "" || username == null) { response.status(422).json('username can not be an empty string'); return; }
    if(password == "" || password == null) { response.status(422).json('password can not be an empty string'); return; }
    if(email == "" || email == null) { response.status(422).json('email can not be an empty string'); return; }

    var sqlRequest = new db.Request();
    sqlRequest.input('Username', db.VarChar, username);
    sqlRequest.input('Password',db.VarChar,password);
    sqlRequest.input('Email', db.VarChar, email); 

    sqlRequest.query("INSERT INTO Account (Name, Password, Email) VALUES (@Username, @Password, @Email); SELECT SCOPE_IDENTITY() as ID", function (error, result) {
        if(error){
            if(error.number == 2627) response.status(400).json('email or username already exist' + error);
            else response.status(500).json(error);
            return;
        }
        response.status(201).json('Location: users/' + result.recordset[0].ID);      
    });
}); 
// Description: Update a user 
// PUT /users/id
// uri: id of user
// Body: { "description": "some text"}
app.put('/users/:id', function(request, response){

    const id = parseInt(request.params.id);
    const description = request.body.description;

    if(!(numRegex.test(id))){ response.status(400).json('id can not contain letters'); return; }
    if(description == "" || description == null){ response.status(422).json('description can not be empty'); return; }

        var sqlRequest = new db.Request();
        sqlRequest.input('Id', db.Int, id);
        sqlRequest.input('Description', db.Text, description)

        sqlRequest.query("UPDATE Account SET Description = @Description WHERE ID = @Id ", function(error, result){
            if(error) { response.status(500).json(error); return; } 
            // server is fuckedup and sometimes result is undefined   
            if(!result) { response.status(400).json('user does not exist !!'); return; }
            if(result.rowsAffected == 0) {response.status(400).json('user does not exist'); return; }
            response.status(200).json('user updated');
      });
});
// Description: Delete a user
// Delete /users/id
// uri: id of user
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
            // server is fuckedup and sometimes result is undefined   
            if(!result) { response.status(400).json('user does not exist !!'); return; }
            if (result.rowsAffected == 0) { response.status(400).json('user does not exist'); return; }
            response.status(204).json('user deleted')
        })
});
 // -------------------------------------------------------------------- Comments --------------------------------------------------------------------
// Description: Get a list of all comments to a specific post
// Get /id/comments  
// uri: id of the post
app.get('/:id/comments', function(request, response){
    const id = parseInt(request.params.id);
    if(!(numRegex.test(id))){ response.status(400).json('id can not contain letters'); return; }

    var sqlRequest = new db.Request();
    sqlRequest.input('Id', db.Int, id);

    sqlRequest.query("SELECT * FROM Comment WHERE PID = @Id", function(error, result){
        if(error){ 
            console.log(error);
            console.log(error.number);
            response.status(500).json(error); 
            return; 
        }
        // server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(400).json('post does not exist'); return; }     
        if(result.recordset.length == 0){ response.status(400).json('post does not exist'); return; }
        response.status(200).json(result);  
    })
});
// Description: Get a comment
// GET /comments/id  
// uri: id of the comment
app.get('/comments/:id', function(request, response){
    const id = parseInt(request.params.id);
    if(!(numRegex.test(id))){ response.status(400).json('id can not contain letters'); return; }

    var sqlRequest = new db.Request();
    sqlRequest.input('Id', db.Int, id);

    sqlRequest.query("SELECT * FROM Comment WHERE ID = @Id", function (error, result){
        if(error){ 
            console.log(error);
            console.log(error.number);
            response.status(500).json(error); 
            return; 
        }
        // server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(400).json('comment does not exist'); return; }     
        if(result.recordset.length == 0){ response.status(400).json('comment does not exist'); return; }
        response.status(200).json(result.recordset[0]);  
    })
});
// Description: Create a comment
// POST /comments
// Body: { content": "some text", "time": 343242, "postid": 4 }
app.post('/comments', function(request, response){

    var content = request.body.content;
    var time = request.body.time;
    var pid = request.body.postid;
    var uid = request.body.userid;
    var username = request.body.username;

    // if input is not valid
    if(content == "") { response.status(422).json('content can not be an empty string'); return; }
    if(!(numRegex.test(time))) { response.status(422).json('time can not contain letters'); return; }
    if(!(numRegex.test(pid))) { response.status(422).json('postid can not contain letters'); return; }

    var sqlRequest = new db.Request();

    sqlRequest.input('Content',db.Text, content);
    sqlRequest.input('Time', db.Text, time);
    sqlRequest.input('Pid', db.Int, pid);
     /* 
     TODO:
     Check if user exist, if so get username 
     */
    sqlRequest.query("INSERT INTO Comment (Content, Time, PID, Username) VALUES (@Content, @Time, @Pid, 'Alice'); SELECT SCOPE_IDENTITY() as ID", function(error, result){
            
        if(error) {
            if(error.number == 547) response.status(400).json('user or post does not exist' + error);
            else response.status(500).json(error);  
            return;
        }
        // server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(400).json('user or post does not exist !!'); return; }   
        //response.json(result);
        response.status(201).json('Location: /comments/' + result.recordset[0].ID)
    });
});
//Description: update the like and dislike count in a comment
// UPDATE /comments/id
// uri: id of the comment
// Body: {"like": 3, "dislike": 2}
app.put('/comments/:id', function(request, response){
    const id = parseInt(request.params.id);
    if(!(numRegex.test(id))){ response.status(400).json('id can not contain letters'); return; }

    var like = request.body.like;
    var dislike = request.body.dislike

    if(!(numRegex.test(like)) || !(numRegex.test(dislike))) { response.status(422).json('like and dislike can not contain letters'); return; }

    sqlRequest = new db.Request();
    sqlRequest.input('Id', db.Int, id);
    sqlRequest.input('Like', db.Int, like);
    sqlRequest.input('Dislike', db.Int, dislike);


    sqlRequest.query("UPDATE Comment SET LikeCount = @Like, DislikeCount = @Dislike WHERE ID = @Id ", function(error, result){
        if(error) { response.status(500).json(error); return; } 
        // server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(400).json('comment does not exist !!'); return; }
        if(result.rowsAffected == 0) {response.status(400).json('comment does not exist'); return; }
        response.status(200).json('comment updated');

        });
});

// Description: Delete a comment
// DELETE /comments/id
// uri: id of the comment 
app.delete('/comments/:id', function(request, response){
    const id = parseInt(request.params.id);
    if(!(numRegex.test(id))){ response.status(400).json('id can not contain letters'); return; }

    var sqlRequest = new db.Request();
    sqlRequest.input('Id', db.Int, id);
   
    sqlRequest.query("DELETE FROM Comment WHERE ID = @Id", function (error, result){
        if (error) {
            console.log(error.number);
            console.log(error);
            response.status(500).json(error);
            return; 
        } 
        // database or server is fuckedup and sometimes result is undefined   
        if(!result) { response.status(400).json('comment does not exist !!'); return; }
        if (result.rowsAffected == 0) { response.status(400).json('comment does not exist'); return; }
        response.status(204).json('comment deleted')
    })

})
/* TODO 
- Fix proper error messages
*/

app.listen(8000);




