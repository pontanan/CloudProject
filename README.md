#Table of contents
* [POSTS](https://github.com/pontanan/CloudProject#posts)
*
*
*
*
*

# POSTS

### Get list of all posts
```
GET /posts
```

###### Response
_If succcessfully fetched, response contains satus 200 and an array with all the posts_
```
status: 200 OK
content-type: application/json
[{PID: 1, UID: 67, Content: 'here is some content', LikeCount: 7, DislikeCount: 9, Time: 467546546}, ...] 
```

___
<br>

### Get specific post
```
GET /posts/123
```

###### Input
Name | Type | Description
---  | ---  | ---
PID  | int  | ID of the post sent in the uri

###### Response
_If succcessfully fetched post, the response contains satus 200 and the fetched post_
```
status: 200 OK
content-type: application/json
PID: 1
UID: 67
Content: 'here is some content'
LikeCount: 7
DislikeCount: 9
Time: 467546546
```

###### Response
_If post does not exist_
```
status: 400 BAD REQUEST
```

___
<br>

### Create new post
```
POST /posts
```

###### Input
Name    |  Type  | Description
---     |   ---  | ---
UID     |   int  | ID of the user that created the post, sent in the body
Content | string | Content of the post, sent in the body
Time    |   int  | Time of the post creation, sent in the body
   
###### Body of request
_If succcessfully fetched post, the response contains satus 200 and the fetched post_
```
content-type: application/json
{
"UID": 123
"Content": "here is some content"
"Time": 467546546
}
```

###### Response
_If user exist and content is not an empty string, the response contains status code 201 and the new created post._
```
status: 201 CREATED
Location: /posts/567
```

###### Response
_If user does not exist or content is an empty string_
```
Status: 400 BAD REQUEST
```

___
<br>

### Delete specific post
```
DELETE /posts/123
```

###### Input
Name | Type | Description
---  | ---  | ---
PID  | int  | ID of the post sent in the uri

###### Response
_If successfully deleted_
```
Status: 204 DELETED
```

###### Response
_if post does not exist_
```
Status: 400 BAD REQUEST
```

<br>
<br>
<br>


# COMMENTS

### Get list of all comments to a specific post
```
GET /posts/123/comments
```

###### Input
Name | Type | Description
---  | ---  | ---
PID  | int  | ID of the post sent in the uri

###### Response
_If succcessfully fetched, the response contains status 200 and an array with all the comments to the post_
```
status: 200 OK
content-type: application/json
[{ID: 43, UID: 37, PID: 123, Content: 'here is some content', LikeCount: 7, DislikeCount: 9, Time: 467546546}, ...] 
```

___
<br>

### Get specific comment
```
GET /comments/123
```

###### Input
Name | Type | Description
---  | ---  | ---
CID  | int  | ID of the post sent in the uri

###### Response
_If successfully fetched the comment, response contains status 200 and the comment_
```
status: 200 OK
content-type: application/json
CID: 123
UID: 55
PID: 12
Content: "some content"
LikeCount: 2
DislikeCount: 10
Time: 657654432467533
```

###### Response
_If post or comment does not exist_
```
status: 400 BAD REQUEST
```

___
<br>

### Create a new comment
```
POST /comments
```

###### Input
Name    |  Type  | Description
---     |   ---  | ---
UID     |   int  | ID of the user creating the comment, sent in the body 
PID     |   int  | ID of the post the comment is made on, sent in the body
Content | string | Content of the comment, sent in the body
   
###### Body of request
_If succcessfully fetched post, the response contains satus 200 and the fetched post_
```
content-type: application/json
{
"UID": 123
"PID": 456
"Content": "content of comment"
}
```

###### Response
_If successfully created a comment, the response contains status 201 and the new comment_
```
status: 201 CREATED
Location: /comments/123
```

###### Response
_If post does not exist_
```
Status: 400 BAD REQUEST
```

___
<br>

### Delete a specific comment
```
DELETE /comments/123
```

###### Input
Name | Type | Description
---  | ---  | ---
CID  | int  | ID of the comment sent in the uri

###### Response
_If successfully deleted the comment_
```
Status: 204 DELETED
```

###### Response
_if post or comment does not exist_
```
Status: 400 BAD REQUEST
```

<br>
<br>
<br>


# USER

### Get user content (Name and Description)
```
GET /users/123
```

###### Input
Name | Type | Description
---  | ---  | ---
UID  | int  | ID of the user sent in the uri

###### Response
_If user exist, the response contains status 200 and the user name plus description_
```
status: 200 OK
content-type: application/json
Name: "Sten"
Description: "Hejsan"
```

###### Response
_If user does not exist_
```
status: 400 BAD REQUEST
```

___
<br>

### Update user description
```
UPDATE /users/123
```

###### Input
Name    |  Type  | Description
---     |   ---  | ---
UID     |   int  | ID of the post sent in the uri
Content | string | Content of description, sent in the body

###### Body of request
```
content-type: application/json
{
"Content": "content of description"
}
```

###### Response
_If successfully updated user, response contains status 200 _
```
status: 200 OK
content-type: application/json
```

###### Response
_If user does not exist_
```
status: 400 BAD REQUEST
```

___
<br>

### Create user
```
POST /users
```

###### Input
Name     |  Type  | Description
---      |   ---  | ---
Name     |   int  | ID of the user creating the comment, sent in the body
Password |   int  | ID of the post the comment is made on, sent in the body
Email    | string | Content of the comment, sent in the body
   
###### Body of request
_If succcessfully fetched post, the response contains satus 200 and the fetched post_
```
content-type: application/json
{
"Name": "Alice"
"Password": "H&EFK#F5454LKJFLS25#3254"
"Email": "alice123@gmail.com"
}
```

###### Response
_If successfully created user, response contains status 201 and the new user_
```
Status: 201 CREATED
content-type: application/json
Location: /users/345
```

###### Response
_If user-name or email is already taken _
```
Status: 400 BAD REQUEST
```

___
<br>

### Delete user
```
DELETE /users/123
```

###### Input
Name | Type | Description
---  | ---  | ---
UID  | int  | ID of the user sent in the uri

###### Response
_If successfully deleted user_
```
Status: 204 DELETED
```

###### Response
_if user does not exist_
```
Status: 400 BAD REQUEST
```
