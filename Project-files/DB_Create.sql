CREATE DATABASE cityforumDB

CREATE Account
(
	ID int IDENTITY(1,1) PRIMARY KEY,
	Name varchar(50) NOT NULL,
	Password varchar(255) NOT NULL,
	Email varchar(255) NOT NULL,
	Description text
);
GO

CREATE Post
(
	ID int IDENTITY(1,1) PRIMARY KEY,
	Content text,
	LikeCount int,
	DislikeCount int,
	Time int,
	UID int FOREIGN KEY REFERENCES User(ID)
);
GO

CREATE Comment
(
	ID int IDENTITY(1,1) PRIMARY KEY,
	Number int,
	LikeCount int,
	DislikeCount int,
	Content text,
	Time int,
	PID int FOREIGN KEY REFERENCES Post(ID),
	UID int FOREIGN KEY REFERENCES User(ID)
);
GO

CREATE Like_Comment
(
	ID int IDENTITY(1,1) PRIMARY KEY,
	CID int FOREIGN KEY REFERENCES Comment(ID),
	UID int FOREIGN KEY REFERENCES User(ID)
);
GO

CREATE Like_Post
(
	ID int IDENTITY(1,1) PRIMARY KEY,
	PID int FOREIGN KEY REFERENCES Post(ID),
	UID int FOREIGN KEY REFERENCES User(ID)
);
GO