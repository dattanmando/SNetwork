# SNetwork

A backend social network API. A user can create and modify users, thoughts, reactions, and relationships.

## Technologies Used

- TypeScript
- Node.js
- Express.js
- MongoDB
- Insomnia

## Endpoints

* Get all user GET /api/users 
* Get user GET /api/users/:id 
* Create UserPOST /api/users
* Update User PUT /api/users/:id 
* Add Friend POST /api/users/:userId/friends/:friendId 
* Get all thoughts GET /api/thoughts
* Get thought GET /api/thoughts/:id
* Create thought POST /api/thoughts
* Update thought PUT /api/thoughts/:id
* Add reaction POST /api/thoughts/:thoughtId/reactions
* Delete user DELETE /api/users/:id
* Remove friend DELETE /api/users/:userId/friends/:friendId
* Delete thought DELETE /api/thoughts/:id
* Remove reaction /api/thoughts/:thoughtId/reactions/:reactionId

## Walkthrough

   
## Author
Tanner Chamberlain
https://github.com/dattanmando
