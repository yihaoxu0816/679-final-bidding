// import { getUsers } from './users.js';
// import { handleGet, handlePost, handleDelete, handlePatch } from './api.js';

// // Backend API URL - override the default from api.js
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:6790';
// const POSTS_ENDPOINT = `${API_URL}/posts`;
// const USERS_ENDPOINT = `${API_URL}/users`;

// /**
//  * NOTE: You do not need to change this function! 
//  * If your implementations of getPosts() and getUsers()
//  * are working, this function will work just fine.
//  * 
//  * Get all posts with author names added (as opposed to just author ids)
//  * @param {number} author (optional) - The author ID to filter posts by.
//  * @returns {Promise<Object[]>} - An array of post objects with author names.
//  */
// const getPostsWithAuthorNames = async (authorId = null) => {
//   let posts = await getPosts(authorId);
//   let users = await getUsers();

//   return posts.map((post) => {
//     const user = users.find((user) => user.id === post.authorId);
//     if (!user) {
//       throw new Error(`Post ${post.id} found with uknown author ${post.authorId}`);
//     }
//     return {
//       ...post,
//       authorName: user?.displayName ?? 'Unknown Author'
//     };
//   });
// };

// /**
//  * NOTE: You do not need to change this function! 
//  * If your implementations of getPost() and getUsers()
//  * are working, this function will work just fine.
//  * 
//  * Get a single post with author name added (as opposed to just author id)
//  * @param {String} postId - The post to get.
//  * @returns {Promise<Object>} - A post object with author name added.
//  */
// const getPostWithAuthorName = async (postId) => {
//   let users = await getUsers();
//   let thePost = await getPost(postId);
  
//   if (!thePost) {
//     throw new Error(`Post ${postId} not found.`);
//   }

//   let theAuthor = users.find(user => user.id === thePost.authorId);
//   if (!theAuthor) {
//     throw new Error(`Post ${thePost.id} has unknown author ${thePost.authorId}`);
//   }

//   thePost.authorName = theAuthor?.displayName ?? 'Unknown Author';
//   return thePost;
// }

// /**
//  * NOTE: You do not need to change this function! 
//  * If your implementations of getPosts() and deletePost()
//  * are working, this function will work just fine.
//  * 
//  * Delete all posts by a user. Needed when a user is deleted.
//  * @param {String} postId - The post to get.
//  * @returns {Promise<Object>} - A post object with author name added.
//  */
// const deletePostsByUser = async (userId) => {
//   const postsByUser = await getPosts(userId);
//   postsByUser.forEach(async post => {
//     await deletePost(post.id);
//   })
// }

// /**
//  * Get all posts.
//  * If an author is provided, it will return only posts by that author.
//  * @param {String} author (optional) - The author ID to filter posts by.
//  * @returns {Promise<Object[]>} - An array of post objects.
//  */
// const getPosts = async (authorId = null) => {
//   if (authorId) {
//     // Get posts by a specific user
//     return await handleGet(`${USERS_ENDPOINT}/${authorId}/posts`);
//   }
//   // Get all posts
//   return await handleGet(POSTS_ENDPOINT);
// };

// /**
//  * Get a post by its ID.
//  * @param {String} id - The ID of the post to get.
//  * @returns {Promise<Object>} - The post object if found, undefined otherwise
//  */
// const getPost = async (id) => {
//   const allPosts = await handleGet(POSTS_ENDPOINT);
//   return allPosts.find(post => post.id === id);
// };

// /**
//  * Create a new (blog) post.
//  * @param {Object} postData - The post data to create.
//  * @returns {Promise<Object>} - The created post object.
//  */
// const createPost = async (postData) => {
//   // Get JWT token from localStorage
//   const jwt = localStorage.getItem('jwt');
  
//   const response = await fetch(`${USERS_ENDPOINT}/${postData.authorId}/posts`, {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${jwt}`
//     },
//     body: JSON.stringify(postData)
//   });
  
//   if (!response.ok) {
//     throw new Error(`Failed to create post: ${response.statusText}`);
//   }
  
//   // Fetch the updated posts list to get the newly created post
//   const posts = await getPosts(postData.authorId);
//   // Return the most recently created post (should be last in array or have latest timestamp)
//   return posts[posts.length - 1];
// };

// /**
//  * Update a post.
//  * @param {String} id - The ID of the post to update.
//  * @param {Object} updatedFields - The fields to update.
//  * @returns {Promise<Object>} - The updated post object.
//  *   Fields not included in the object will not be updated.
//  * @throws {Error} - if post not found
//  */
// const updatePost = async(id, updatedFields) => {
//   // Get JWT token from localStorage
//   const jwt = localStorage.getItem('jwt');
  
//   if (!jwt) {
//     throw new Error('Not authenticated. Please login first.');
//   }
  
//   const response = await fetch(`${POSTS_ENDPOINT}/${id}`, {
//     method: 'PATCH',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${jwt}`
//     },
//     body: JSON.stringify(updatedFields)
//   });
  
//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`Failed to update post: ${errorText || response.statusText}`);
//   }
  
//   return await getPost(id);
// };

// /**
//  * Delete a post.
//  * @param {String} id - The ID of the post to delete.
//  * @returns {Promise<void>} - A promise that resolves when the post is deleted.
//  */
// const deletePost = async(id) => {
//   // Get JWT token from localStorage
//   const jwt = localStorage.getItem('jwt');
  
//   if (!jwt) {
//     throw new Error('Not authenticated. Please login first.');
//   }
  
//   const response = await fetch(`${POSTS_ENDPOINT}/${id}`, {
//     method: 'DELETE',
//     headers: { 
//       'Authorization': `Bearer ${jwt}`
//     }
//   });
  
//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`Failed to delete post: ${errorText || response.statusText}`);
//   }
// };

// export { 
//   getPostsWithAuthorNames,
//   getPostWithAuthorName,
//   deletePostsByUser,
//   getPosts, 
//   getPost, 
//   createPost, 
//   updatePost, 
//   deletePost, 
// };