# CloudProject

### POSTS

##### Get list of all posts
---
| GET /posts |

##### Response
If succcessfully fetched, response contains satus 200 and an array with all the posts
| status: 200 OK |
| content-type: application/json |
| [{post-id: 1, user-id: 67, content: 'here is some content', LikeCount: 7, DislikeCount: 9, Time: 467546546}, ...] |
