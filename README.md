# CloudProject

### POSTS

#### Get list of all posts
```
GET /posts
```

###### Response
If succcessfully fetched, response contains satus 200 and an array with all the posts
```
status: 200 OK
content-type: application/json
[{PID: 1, UID: 67, Content: 'here is some content', LikeCount: 7, DislikeCount: 9, Time: 467546546}, ...] 
```

<br>

#### Get specific post
```
GET /posts/123
```

###### Input
Name | Type | Description
---  | ---  | ---
 PID | int  | ID of the post sent in the uri

###### Response
If succcessfully fetched post, the response contains satus 200 and the fetched post
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
If post does not exist
```
status: 400 BAD REQUEST
```

<br>

#### Create new post
```
POST /posts
```

###### Input
   Name |  Type  | Description
   ---  |   ---  | ---
    UID |   int  | ID of the user that created the post, sent in the body
Content | string | Content of the post, sent in the body
   Time |   int  | Time of the post creation, sent in the body
   
###### Body of request
If succcessfully fetched post, the response contains satus 200 and the fetched post
```
content-type: application/json
{
"UID": 123
"Content": "here is some content"
"Time": 467546546
}
```

###### Response
If user exist and content is not an empty string, the response contains status code 201 and the new created post.
```
status: 201 CREATED
Location: /posts/567
```

###### Response
If user does not exist or content is an empty string
```
Status: 400 BAD REQUEST
```

#### Delete specific post
```
DELETE /posts/123
```

###### Input
Name | Type | Description
 PID | int  | ID of the post sent in the uri

###### Response
If successfully deleted
```
Status: 204 DELETED
```

###### Response
if post does not exist
```
Status: 400 BAD REQUEST
```
