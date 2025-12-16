import express from 'express';
import { userControllers } from '../controllers/userControllers.js';
import { validateJWT } from '../middleware/validateJWT.js';

const userRouter = express.Router();

// Get all users
userRouter.get('/', userControllers.getAllUsers);

// Get a user by id
userRouter.get('/:id', userControllers.getUser);

// Create a user
userRouter.post('/', userControllers.createUser);

// Update a user (requires authentication)
userRouter.patch('/:id', validateJWT, userControllers.updateUser);

// Delete a user
userRouter.delete('/:id', userControllers.deleteUser);

export { userRouter };