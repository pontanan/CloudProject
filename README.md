# CloudProject

## POSTS

#### Get list of all posts
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

---
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

---
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

---
<br>

#### Delete specific post
```
DELETE /posts/123
```

###### Input
Name | Type | Description
 PID | int  | ID of the post sent in the uri

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
