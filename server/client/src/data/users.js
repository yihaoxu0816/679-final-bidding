import { deleteRoomsByUser } from "./rooms.js";
import { handleGet, handlePost, handleDelete, handlePatch } from './api.js';

// Backend API URL - override the default from api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:6790';
const USERS_ENDPOINT = `${API_URL}/api/users`;
const AUTH_ENDPOINT = `${API_URL}/api/auth`;

/**
 * Get a user by their ID.
 * @param {String} id - The ID of the user to get.
 * @returns {Promise<Object>} - The user object or undefined if not found.
 */
const getUserById = async(id) => {
  return await handleGet(`${USERS_ENDPOINT}/${id}`);
};

/**
 * Get all users.
 * @returns {Promise<Object[]>} - An array of user objects.
 */
const getUsers = async () => {
  return await handleGet(USERS_ENDPOINT);
};

/**
 * Register a new user (public endpoint - no authentication required).
 * @param {String} username - The username of the user to register.
 * @param {String} password - The password of the user to register.
 * @returns {Promise<void>} - Resolves when registration is successful.
 */
const registerUser = async (username, password) => {
  const response = await fetch(`${AUTH_ENDPOINT}/register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to register user: ${errorText || response.statusText}`);
  }
};

/**
 * Login a user and store the JWT token.
 * @param {String} username - The username of the user to login.
 * @param {String} password - The password of the user to login.
 * @returns {Promise<Object>} - The user object with JWT token.
 * @throws {Error} - If the user is not found or the password is incorrect.
 */
const loginUser = async (username, password) => {
  const response = await fetch(`${AUTH_ENDPOINT}/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Login failed");
  }
  
  const user = await response.json();
  
  // Store JWT token in localStorage
  if (user.jwt) {
    localStorage.setItem('jwt', user.jwt);
    // Store user info (without password)
    localStorage.setItem('userId', user.id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('balance', user.balance.toString());
  }
  
  return user;
};

/**
 * Logout a user by clearing stored data.
 */
const logoutUser = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('balance');
};

/**
 * Get the currently logged in user from localStorage.
 * @returns {Object|null} - User info if logged in, null otherwise.
 */
const getCurrentUser = () => {
  const jwt = localStorage.getItem('jwt');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const balance = localStorage.getItem('balance');
  
  if (jwt && userId) {
    return { 
      id: userId, 
      username, 
      balance: balance ? parseFloat(balance) : 0,
      jwt 
    };
  }
  return null;
};

/**
 * Update a user's information.
 * @param {String} id - The ID of the user to update.
 * @param {Object} updatedFields - The fields to update (e.g., username, password, balance).
 *   Fields not included in the object will not be updated.
 * @returns {Promise<Object>} - The updated user object.
 * @throws {Error} - if user not found
 */
const updateUser = async (id, updatedFields) => {
  // Get JWT token from localStorage
  const jwt = localStorage.getItem('jwt');
  
  if (!jwt) {
    throw new Error('Not authenticated. Please login first.');
  }
  
  const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify(updatedFields)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update user: ${errorText || response.statusText}`);
  }
  
  return await response.json();
};

/**
 * Delete a user and all their associated rooms.
 * @param {String} id - The ID of the user to delete.
 * @returns {Promise<void>} - A promise that resolves when the user is deleted.
 */
const deleteUser = async (id) => {
  // First delete all rooms created by this user
  await deleteRoomsByUser(id);
  
  const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete user: ${errorText || response.statusText}`);
  }
  
  // If deleting self, logout
  const currentUserId = localStorage.getItem('userId');
  if (currentUserId === id) {
    logoutUser();
  }
};

export {
  getUserById,
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUser,
  deleteUser,
};
