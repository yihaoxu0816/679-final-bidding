import { userService } from '../services/userService.js';

const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await userService.getAllUsers();
        res.json(allUsers);
    } catch (error) {
        next(error);
    }
}

const getUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await userService.getUserById(id);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

const createUser = async (req, res, next) => {
    try {
        const postData = req.body;
        const {id} = await userService.createUser(postData);
        res.json({id});
    } catch (error) {
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedUser = await userService.updateUser(id, req.body);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {result} = await userService.deleteUser(id);
        res.json({result});
    } catch (error) {
        next(error);
    }
}

export const userControllers = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
}