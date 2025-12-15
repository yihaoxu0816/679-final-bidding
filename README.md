# SI 679 - Project 1 - Blogtastic

In this project you will build the backend for a simple blogging webapp named Blogtastic. 

The starter code includes a full-fledged React client that uses mock data within the front end to demonstrate the intended functionality. 

The starter code also includes backend Express app that currently does close to nothing. All it can do is start up, add the `cors()` middleware, and listen on the port specified in server.js. You will need to implement all of the backend routes and REST layers, and then replace the mock data handling functionality in the `/client/src/data` directory to make things work. 

## Getting Started
* clone the repo
* install npm packages in *both* client and server directories:
```
$ git clone <your repo URL>
$ cd <your clone dir>
$ cd client
$ npm i
$ cd ../server
$ npm i
```
* run the client 
```
$ cd ../client
$ npm start
```
* test it out to get a feel for how it works. Be sure to test what you can do without logging in (i.e., as a non-authenticated user) as well as logging in with a username and password from the mock user data in `/client/src/data/users.js`.
* run the server
```
$ cd ../server
$ npm start
```
* it doesn't really do anything, as you'll see, but you shouldn't see any errors (if you do, review the above steps to see if you missed anything).

## Work on the Project

### In the client
You should not have to touch any code outside of `/client/src/data/users.js` and `/client/src/data/posts.js`. You will have to change most of the functions in those files, however, to work with your backend. The only exceptions are the two functions in `posts.js` that explicitly say in the comments that you don't need to change them. 

You also don't need to change anything in `/client/src/data/api.js`, but you will want to familiarize yourself with those functions, as they're the ones you'll need to use in your revised `users.js` and `posts.js` functions to access your backend.

The only other thing you will need to do in the client is create a file named `.env` with the following contents:

```
REACT_APP_API_URL='http://localhost:6790'
```
That's what the contents will be if you don't change the port in your `server.js`, otherwise you'll need to change the URL accordingly. Note that the environment variable name MUST start with REACT_APP_ in order for React's environment variable handling to work. FYI this variable is read in `api.js` on line 1.

### In the server
Well, in the server, you'll have to do it all, won't you? Build your routes, controllers, services, db access functions, models, etc. -- using what we've covered in the course up to this point. In addition to building the layers and wiring the backend into the frontend, you'll need to 
* use `bcrypt` to ensure that user passwords are not sent to the backend or stored in the DB in cleartext
* use `jwt` to ensure that endpoints that allow data modification (i.e., creating/editing/deleting posts and users) cannot be accessed by non-authenticated users
* write unit and integration tests using `jest` that ensure your backend is robust and accurate. [Note: you do not have to write tests for the front end. If you find bugs, report them on slack.]

## Grading

| No. | Requirement | Points |
|-----|-------------|--------|
|1|View all posts (non-authenticated)|10|
|2|View single post (non-authenticated)|10|
|3|Log in (unencrypted, superceded by #10) |5|
|4|Create post|25|
|5|Modify post|25|
|6|Delete post|20|
|7|Create user|25|
|8|Update user|25|
|9|Delete user|20|
|10|Encrypted login and password storage|25|
|11|Protect routes with JWT|25|
|12|Well designed unit tests, >80% coverage|25|
|13|Employ REST best practices (route names, layers)|30|
|14|Code readability, organization, and style|30|
| | **Total** | 300 |
