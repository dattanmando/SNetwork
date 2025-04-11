"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFriend = exports.addFriend = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const thots_1 = __importDefault(require("../models/thots"));
// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User_1.default.find().populate('friends').populate('thoughts');
        console.log('[GET /users] Retrieved all users');
        res.json(users);
    }
    catch (err) {
        console.error('[ERROR GET /users]', err);
        res.status(500).json({ error: 'Failed to get users' });
    }
};
exports.getUsers = getUsers;
// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id)
            .populate('friends')
            .populate('thoughts');
        if (!user) {
            console.log(`[GET /users/${req.params.id}] User not found`);
            res.status(404).json({ message: 'User not found' });
        }
        console.log(`[GET /users/${req.params.id}] Found user`);
        res.json(user);
    }
    catch (err) {
        console.error(`[ERROR GET /users/${req.params.id}]`, err);
        res.status(500).json({ error: 'Failed to get user' });
    }
};
exports.getUserById = getUserById;
// Create a new user
const createUser = async (req, res) => {
    try {
        const user = await User_1.default.create(req.body);
        console.log('[POST /users] Created new user:', user.username);
        res.status(201).json(user);
    }
    catch (err) {
        console.error('[ERROR POST /users]', err);
        res.status(400).json({ error: 'Failed to create user' });
    }
};
exports.createUser = createUser;
// Update a user
const updateUser = async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            console.log(`[PUT /users/${req.params.id}] User not found`);
            res.status(404).json({ message: 'User not found' });
        }
        console.log(`[PUT /users/${req.params.id}] Updated user`);
        res.json(user);
    }
    catch (err) {
        console.error(`[ERROR PUT /users/${req.params.id}]`, err);
        res.status(400).json({ error: 'Failed to update user' });
    }
};
exports.updateUser = updateUser;
// Delete a user and optionally their thoughts (Bonus!)
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            console.log(`[DELETE /users/${req.params.id}] User not found`);
            res.status(404).json({ message: 'User not found' });
            return; // Added return to prevent further execution
        }
        // BONUS: Delete their thoughts too
        await thots_1.default.deleteMany({ _id: { $in: user.thoughts } });
        console.log(`[DELETE /users/${req.params.id}] Deleted user and their thoughts`);
        res.json({ message: 'User and associated thoughts deleted' });
    }
    catch (err) {
        console.error(`[ERROR DELETE /users/${req.params.id}]`, err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
exports.deleteUser = deleteUser;
// Add a friend
const addFriend = async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.params.userId, { $addToSet: { friends: req.params.friendId } }, { new: true });
        if (!user) {
            console.log(`[POST /users/${req.params.userId}/friends/${req.params.friendId}] User not found`);
            res.status(404).json({ message: 'User not found' });
        }
        console.log(`[POST /users/${req.params.userId}/friends/${req.params.friendId}] Added friend`);
        res.json(user);
    }
    catch (err) {
        console.error(`[ERROR POST /users/${req.params.userId}/friends/${req.params.friendId}]`, err);
        res.status(500).json({ error: 'Failed to add friend' });
    }
};
exports.addFriend = addFriend;
// Remove a friend
const removeFriend = async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.params.friendId } }, { new: true });
        if (!user) {
            console.log(`[DELETE /users/${req.params.userId}/friends/${req.params.friendId}] User not found`);
            res.status(404).json({ message: 'User not found' });
        }
        console.log(`[DELETE /users/${req.params.userId}/friends/${req.params.friendId}] Removed friend`);
        res.json(user);
    }
    catch (err) {
        console.error(`[ERROR DELETE /users/${req.params.userId}/friends/${req.params.friendId}]`, err);
        res.status(500).json({ error: 'Failed to remove friend' });
    }
};
exports.removeFriend = removeFriend;
