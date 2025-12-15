// import { deletePostsByUser } from "./posts";
// import { handleGet, handlePost, handleDelete, handlePatch } from './api.js';

// // Backend API URL - override the default from api.js
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:6790';
// const USERS_ENDPOINT = `${API_URL}/users`;
// const AUTH_ENDPOINT = `${API_URL}/auth`;

// /**
//  * Get a user by their ID.
//  * @param {String} id - The ID of the user to get.
//  * @returns {Promise<Object>} - The user object or undefined if not found.
//  */
// const getUserById = async(id) => {
//   return await handleGet(`${USERS_ENDPOINT}/${id}`);
// };

// /**
//  * Get all users.
//  * @returns {Promise<Object[]>} - An array of user objects.
//  */
// const getUsers = async () => {
//   return await handleGet(USERS_ENDPOINT);
// };

// /**
//  * This function is used to create a new user.
//  * @param {String} username - The username of the user to create.
//  * @param {String} password - The password of the user to create.
//  * @param {String} displayName - The display name of the user to create.
//  * @returns {Promise<Object>} - The created user object.
//  */
// const createUser = async (username, password, displayName) => {
//   const userData = { 
//     username, 
//     password,
//     displayName
//   };
  
//   // Get JWT token from localStorage
//   const jwt = localStorage.getItem('jwt');
  
//   if (!jwt) {
//     throw new Error('Not authenticated. Please login first.');
//   }
  
//   const response = await fetch(USERS_ENDPOINT, {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${jwt}`
//     },
//     body: JSON.stringify(userData)
//   });
  
//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`Failed to create user: ${errorText || response.statusText}`);
//   }
  
//   const users = await getUsers();
//   return users[users.length - 1];
// };

// /**
//  * This function is used to update a user.
//  * @param {String} id - The ID of the user to update.
//  * @param {Object} updatedFields - The fields to update. 
//  *   Fields not included in the object will not be updated.
//  * @returns {Promise<Object>} - The updated user object.
//  * @throws {Error} - if user not found

//  */
// const updateUser = async (id, updatedFields) => {
//   // Get JWT token from localStorage
//   const jwt = localStorage.getItem('jwt');
  
//   const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
//     method: 'PATCH',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${jwt}`
//     },
//     body: JSON.stringify(updatedFields)
//   });
  
//   if (!response.ok) {
//     throw new Error(`Failed to update user: ${response.statusText}`);
//   }
  
//   return await getUserById(id);
// };

// /**
//  * This function is used to delete a user.
//  * @param {String} id - The ID of the user to delete.
//  * @returns {Promise<void>} - A promise that resolves when the user is deleted.
//  */
// const deleteUser = async (id) => {
//   await deletePostsByUser(id);
  
//   // Get JWT token from localStorage
//   const jwt = localStorage.getItem('jwt');
  
//   const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
//     method: 'DELETE',
//     headers: { 
//       'Authorization': `Bearer ${jwt}`
//     }
//   });
  
//   if (!response.ok) {
//     throw new Error(`Failed to delete user: ${response.statusText}`);
//   }
// };

// /**
//  * This function is used to validate a login.
//  * @param {String} username - The username of the user to validate.
//  * @param {String} password - The password of the user to validate.
//  * @returns {Promise<Object>} - The user object.
//  * @throws {Error} - If the user is not found or the password is incorrect.
//  */
// const validateLogin = async (username, password) => {
//   const response = await fetch(`${AUTH_ENDPOINT}/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username, password })
//   });
  
//   if (!response.ok) {
//     const error = await response.text();
//     throw new Error(error || "Login failed");
//   }
  
//   const user = await response.json();
  
//   if (user.jwt) {
//     localStorage.setItem('jwt', user.jwt);
//   }
  
//   return user;
// };

// export {
//   getUserById,
//   getUsers,
//   createUser,
//   updateUser,
//   deleteUser,
//   validateLogin,
// };