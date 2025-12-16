import { getUsers } from './users.js';
import { handleGet, handlePost, handleDelete, handlePatch } from './api.js';

// Backend API URL - override the default from api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:6790';
const ROOMS_ENDPOINT = `${API_URL}/rooms`;
const USERS_ENDPOINT = `${API_URL}/users`;

/**
 * Get all rooms with host names added (as opposed to just host ids)
 * @param {string} hostId (optional) - The host ID to filter rooms by.
 * @returns {Promise<Object[]>} - An array of room objects with host names.
 */
const getRoomsWithHostNames = async (hostId = null) => {
  let rooms = await getRooms(hostId);
  let users = await getUsers();

  return rooms.map((room) => {
    const user = users.find((user) => user.id === room.hostId);
    if (!user) {
      console.warn(`Room ${room.id} found with unknown host ${room.hostId}`);
    }
    return {
      ...room,
      hostName: user?.username ?? 'Unknown Host'
    };
  });
};

/**
 * Get a single room with host name added (as opposed to just host id)
 * @param {String} roomId - The room to get.
 * @returns {Promise<Object>} - A room object with host name added.
 */
const getRoomWithHostName = async (roomId) => {
  let users = await getUsers();
  let theRoom = await getRoom(roomId);
  
  if (!theRoom) {
    throw new Error(`Room ${roomId} not found.`);
  }

  let theHost = users.find(user => user.id === theRoom.hostId);
  if (!theHost) {
    console.warn(`Room ${theRoom.id} has unknown host ${theRoom.hostId}`);
  }

  theRoom.hostName = theHost?.username ?? 'Unknown Host';
  return theRoom;
}

/**
 * Delete all rooms by a user. Needed when a user is deleted.
 * @param {String} userId - The user whose rooms should be deleted.
 * @returns {Promise<void>}
 */
const deleteRoomsByUser = async (userId) => {
  const roomsByUser = await getRooms(userId);
  for (const room of roomsByUser) {
    await deleteRoom(room.id);
  }
}

/**
 * Get all rooms.
 * If a host is provided, it will return only rooms by that host.
 * @param {String} hostId (optional) - The host ID to filter rooms by.
 * @returns {Promise<Object[]>} - An array of room objects.
 */
const getRooms = async (hostId = null) => {
  if (hostId) {
    // Get rooms by a specific host
    return await handleGet(`${ROOMS_ENDPOINT}/host/${hostId}`);
  }
  // Get all rooms
  return await handleGet(ROOMS_ENDPOINT);
};

/**
 * Get a room by its ID.
 * @param {String} id - The ID of the room to get.
 * @returns {Promise<Object>} - The room object if found
 */
const getRoom = async (id) => {
  return await handleGet(`${ROOMS_ENDPOINT}/${id}`);
};

/**
 * Create a new bidding room.
 * @param {Object} roomData - The room data to create (itemName, itemDescription, startingPrice).
 * @returns {Promise<Object>} - The created room object.
 */
const createRoom = async (roomData) => {
  // Get JWT token from localStorage
  const jwt = localStorage.getItem('jwt');
  
  if (!jwt) {
    throw new Error('Not authenticated. Please login first.');
  }
  
  const response = await fetch(ROOMS_ENDPOINT, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify(roomData)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create room: ${errorText || response.statusText}`);
  }
  
  return await response.json();
};

/**
 * Update a room.
 * @param {String} id - The ID of the room to update.
 * @param {Object} updatedFields - The fields to update.
 * @returns {Promise<Object>} - The updated room object.
 *   Fields not included in the object will not be updated.
 * @throws {Error} - if room not found or update fails
 */
const updateRoom = async(id, updatedFields) => {
  // Get JWT token from localStorage
  const jwt = localStorage.getItem('jwt');
  
  if (!jwt) {
    throw new Error('Not authenticated. Please login first.');
  }
  
  const response = await fetch(`${ROOMS_ENDPOINT}/${id}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify(updatedFields)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update room: ${errorText || response.statusText}`);
  }
  
  return await response.json();
};

/**
 * Close a bidding room.
 * @param {String} id - The ID of the room to close.
 * @returns {Promise<Object>} - The closed room object.
 */
const closeRoom = async(id) => {
  // Get JWT token from localStorage
  const jwt = localStorage.getItem('jwt');
  
  if (!jwt) {
    throw new Error('Not authenticated. Please login first.');
  }
  
  const response = await fetch(`${ROOMS_ENDPOINT}/${id}/close`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify({})
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to close room: ${errorText || response.statusText}`);
  }
  
  return await response.json();
};

/**
 * Delete a room.
 * @param {String} id - The ID of the room to delete.
 * @returns {Promise<void>} - A promise that resolves when the room is deleted.
 */
const deleteRoom = async(id) => {
  // Get JWT token from localStorage
  const jwt = localStorage.getItem('jwt');
  
  if (!jwt) {
    throw new Error('Not authenticated. Please login first.');
  }
  
  const response = await fetch(`${ROOMS_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${jwt}`
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete room: ${errorText || response.statusText}`);
  }
};

/**
 * Get all bids for a specific room.
 * @param {String} roomId - The room ID to get bids for.
 * @returns {Promise<Object[]>} - An array of bid objects.
 */
const getBidsForRoom = async (roomId) => {
  return await handleGet(`${ROOMS_ENDPOINT}/${roomId}/bids`);
};

/**
 * Place a bid in a room.
 * @param {String} roomId - The room ID to place a bid in.
 * @param {number} amount - The bid amount.
 * @returns {Promise<Object>} - The created bid object.
 */
const placeBid = async (roomId, amount) => {
  // Get JWT token from localStorage
  const jwt = localStorage.getItem('jwt');
  
  if (!jwt) {
    throw new Error('You must log in to place a bid');
  }
  
  const response = await fetch(`${ROOMS_ENDPOINT}/${roomId}/bids`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify({ amount })
  });
  
  if (!response.ok) {
    let errorMessage = 'Failed to place bid';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (jsonError) {
      // If JSON parsing fails, use default error message
    }
    throw new Error(errorMessage);
  }
  
  return await response.json();
};

export { 
  getRoomsWithHostNames,
  getRoomWithHostName,
  deleteRoomsByUser,
  getRooms, 
  getRoom, 
  createRoom, 
  updateRoom,
  closeRoom,
  deleteRoom,
  getBidsForRoom,
  placeBid
};
