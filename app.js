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

// Add new post
app.post('/posts', function(request,response){

    const content = request.body.content
    const like = request.body.likeCount
    const dislike = request.body.dislikeCount
    const time = request.body.time
    const uid = request.body.userid
        
    sql.connect(config, function (error) {
    
        if (error) console.log(error);

        // create Request object
        var request = new sql.Request();
        
        request.input('Content',sql.Text,content);
        request.input('Like',sql.Int,like);
        request.input('Dislike',sql.Int, dislike);
        request.input('Time',sql.Int, time);
        request.input('Uid',sql.Int, uid);
        

        //query to the database and get the records
        request.query("INSERT INTO Post VALUES (@Content, @Like , @Dislike, @Time, @Uid)", function (err, recordset) {
        
        if (err) console.log(err)

        // send records as a response
        response.send(recordset);           
        });
    });
});

app.post('/users', function(request, response){

    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query("INSERT INTO Account VALUES ('Ebba', '123', 'ebba123@gmail.com', 'hejhej')", function (err, recordset) {
            
        if (err) console.log(err)

        // send records as a response
        response.send(recordset);
            
        });
    });
});

app.listen(8000);




