import bcrypt from 'bcrypt';
import { db } from '../db/db.js';
import { User } from '../models/user.js';

const SALT_ROUNDS = 11;

const getAllUsers = async () => {
    const userDocs = await db.getAllInCollection(db.USERS);
    return userDocs.map(uDoc => User.fromUserDocument(uDoc));
}

const getUserById = async (id) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    const userDoc = await db.getFromCollectionById(db.USERS, id);
    return User.fromUserDocument(userDoc);
}

const createUser = async (userInfo) => {
    if (!userInfo) throw new Error('Null or undefined user info not allowed.');

    // Hash the password before saving
    const userData = { 
        ...userInfo,
        balance: 100,        // Initialize starting balance
        itemsWon: []         // Initialize empty items won array
    };
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, SALT_ROUNDS);
    }

    const {insertedId} = await db.addToCollection(db.USERS, userData);
    
    // Return user info without password
    const { password: _, ...userWithoutPassword } = userData;
    return {
        id: insertedId.toString(),
        ...userWithoutPassword,
    }
}

const updateUser = async (id, updateInfo) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    if (!updateInfo) throw new Error('Null or undefined user info not allowed.');
    // Remove 'id' field if present - MongoDB uses _id, not id
    const { id: _, ...updateData } = updateInfo;
    
    // If password is being updated, hash it with bcrypt
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
    }
    
    await db.updateFromCollectionById(db.USERS, id, updateData);
    const updatedDoc = await db.getFromCollectionById(db.USERS, id);
    return User.fromUserDocument(updatedDoc);
}

const deleteUser = async (id) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    const {deletedCount} = await db.deleteFromCollectionById(db.USERS, id);
    return {deletedCount};
}

export const userService = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}