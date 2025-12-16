
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { db } from '../db/db.js';

import { User } from '../models/user.js';

const SALT_ROUNDS = 11;

let jwtPrivateKey, jwtPublicKey;

const loadKeys = () => {
    jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
    jwtPublicKey = process.env.JWT_PUBLIC_KEY;
}

const generateToken = (userId) => {
    loadKeys(); 
    let data = {
        time: Date(),
        userId
    }
    return jwt.sign(data, jwtPrivateKey, { algorithm: 'RS256', expiresIn: '1h' });
}

const registerUser = async (username, pword, displayName) => {

    const user = await db.getFromCollectionByFieldValue(db.USERS, 'username', username);
    if (user) {
        throw new Error('User already exists');
    }

    const password = await bcrypt.hash(pword, SALT_ROUNDS);

    const userData = {
        username, 
        password,
        balance: 100,        // Initialize starting balance for bidding
        itemsWon: []         // Initialize empty items won array
    };
    
    const result = await db.addToCollection(db.USERS, userData);

    if (!result.acknowledged || !result.insertedId) {
        throw new Error('Failed to register user');
    }
    return;
}

const validateLogin = async (username, pword) => {
    const userDoc = await db.getFromCollectionByFieldValue(db.USERS, 'username', username);
    if (!userDoc) {
        throw new Error('User not found');
    }

    const user = User.fromUserDocument(userDoc);
    const result = await bcrypt.compare(pword, user.password);
    if (result) {

        const jwt = generateToken(user.id);
        user.jwt = jwt;
        delete user.password;
        return user;
    } else {
        throw new Error('Invalid password');
    }
}


export const authService = {
    registerUser,
    validateLogin,
}