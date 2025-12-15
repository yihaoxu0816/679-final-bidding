import { userService } from '../services/userService.js';

const getAllUsers = async (req, res) => {
    const allUsers = await userService.getAllUsers();
    res.json(allUsers);
}

const getUser = async (req, res) => {
    const {id} = req.params;
    const user = await userService.getUserById(id);
    res.json(user);
}

const createUser = async (req, res) => {
    const postData = req.body;
    const {id} = await userService.createUser(postData);
    res.json({id});
}

const updateUser = async (req, res) => {
    const id = req.params.id;
    const updatedUser = await userService.updateUser(id, req.body);
    res.json(updatedUser);
}

const deleteUser = async (req, res) => {
    const {id} = req.params;
    const {result} = await userService.deleteUser(id);
    res.json({result});
}

export const userControllers = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
}