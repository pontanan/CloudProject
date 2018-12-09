const sql = require('mssql')

var config = {
  user: 'CityForumDBAdmin',
  password: 'cloudService123',
  server: 'cityforumdatabase.c7xajpqu6x8l.eu-west-1.rds.amazonaws.com',
  database: 'cityforumDB'
}

sql.connect(config, function (err) {
  if (err) {
    console.log('problem with server connection');
    console.log(err); 
   }
})

module.exports = sql

// What our database looks like
/*

CREATE DATABASE cityforumDB

CREATE TABLE Account
(
	ID int IDENTITY(1,1) PRIMARY KEY,
	Name varchar(50) NOT NULL,
	Password varchar(255) NOT NULL,
	Email varchar(255) NOT NULL,
	Description text
);
GO

CREATE TABLE Post
(
	ID int IDENTITY(1,1) PRIMARY KEY,
	Content text,
	LikeCount int DEFAULT '0' NOT NULL,
	DislikeCount int DEFAULT '0' NOT NULL,
	Time text,
	City text DEFAULT 'Stockholm',
	UID int FOREIGN KEY REFERENCES Account(ID) ON DELETE CASCADE
);
GO

CREATE TABLE Comment
(
	ID int IDENTITY(1,1) PRIMARY KEY,
	LikeCount int DEFAULT '0' NOT NULL,
	DislikeCount int DEFAULT '0' NOT NULL,
	Content text,
	Time text,
	PID int FOREIGN KEY REFERENCES Post(ID) ON DELETE CASCADE,
	Username varchar(50)
);
GO

CREATE TABLE Like_Comment
(
	ID int IDENTITY(1,1) PRIMARY KEY,
	CID int FOREIGN KEY REFERENCES Comment(ID) ON DELETE CASCADE,
	UID int FOREIGN KEY REFERENCES Account(ID)
);
GO

CREATE TABLE Like_Post
(
	ID int IDENTITY(1,1) PRIMARY KEY,
	PID int FOREIGN KEY REFERENCES Post(ID) ON DELETE CASCADE,
	UID int FOREIGN KEY REFERENCES Account(ID)
);
GO

*/