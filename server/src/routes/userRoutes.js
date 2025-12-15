import express from 'express';
import { userControllers } from '../controllers/userControllers.js';

const userRouter = express.Router();

// Get all users
userRouter.get('/', userControllers.getAllUsers);

// Get a user by id
userRouter.get('/:id', userControllers.getUser);

// Create a user
userRouter.post('/', userControllers.createUser);

// Update a user
userRouter.patch('/:id', userControllers.updateUser);

// Delete a user
userRouter.delete('/:id', userControllers.deleteUser);

export { userRouter };