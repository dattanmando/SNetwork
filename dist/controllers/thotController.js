"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeReaction = exports.addReaction = exports.deleteThought = exports.updateThought = exports.createThought = exports.getThoughtById = exports.getThoughts = void 0;
const thots_1 = __importDefault(require("../models/thots"));
const User_1 = __importDefault(require("../models/User"));
// GET all thoughts
const getThoughts = async (_req, res) => {
    try {
        const thoughts = await thots_1.default.find();
        console.log('[GET /thoughts] All thoughts fetched');
        res.json(thoughts);
    }
    catch (err) {
        console.error('[ERROR GET /thoughts]', err);
        res.status(500).json({ error: 'Failed to fetch thoughts' });
    }
};
exports.getThoughts = getThoughts;
// GET single thought by ID
const getThoughtById = async (req, res) => {
    try {
        const thought = await thots_1.default.findById(req.params.id);
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        console.log(`[GET /thoughts/${req.params.id}] Thought fetched`);
        res.json(thought);
    }
    catch (err) {
        console.error(`[ERROR GET /thoughts/${req.params.id}]`, err);
        res.status(500).json({ error: 'Failed to fetch thought' });
    }
};
exports.getThoughtById = getThoughtById;
// POST create a new thought + push to user's thoughts
const createThought = async (req, res) => {
    try {
        const { thoughtText, username, userId } = req.body;
        const thought = await thots_1.default.create({ thoughtText, username });
        // Push thought to user
        const user = await User_1.default.findByIdAndUpdate(userId, { $push: { thoughts: thought._id } }, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User not found to attach thought' });
            return;
        }
        console.log(`[POST /thoughts] Thought created by ${username}`);
        res.status(201).json(thought);
    }
    catch (err) {
        console.error('[ERROR POST /thoughts]', err);
        res.status(500).json({ error: 'Failed to create thought' });
    }
};
exports.createThought = createThought;
// PUT update a thought
const updateThought = async (req, res) => {
    try {
        const thought = await thots_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        console.log(`[PUT /thoughts/${req.params.id}] Thought updated`);
        res.json(thought);
    }
    catch (err) {
        console.error(`[ERROR PUT /thoughts/${req.params.id}]`, err);
        res.status(500).json({ error: 'Failed to update thought' });
    }
};
exports.updateThought = updateThought;
// DELETE a thought
const deleteThought = async (req, res) => {
    try {
        const thought = await thots_1.default.findByIdAndDelete(req.params.id);
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        console.log(`[DELETE /thoughts/${req.params.id}] Thought deleted`);
        res.json({ message: 'Thought deleted successfully' });
    }
    catch (err) {
        console.error(`[ERROR DELETE /thoughts/${req.params.id}]`, err);
        res.status(500).json({ error: 'Failed to delete thought' });
    }
};
exports.deleteThought = deleteThought;
// POST a reaction to a thought
const addReaction = async (req, res) => {
    try {
        const thought = await thots_1.default.findByIdAndUpdate(req.params.thoughtId, { $push: { reactions: req.body } }, { new: true, runValidators: true });
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        console.log(`[POST /thoughts/${req.params.thoughtId}/reactions] Reaction added`);
        res.json(thought);
    }
    catch (err) {
        console.error(`[ERROR POST /thoughts/${req.params.thoughtId}/reactions]`, err);
        res.status(500).json({ error: 'Failed to add reaction' });
    }
};
exports.addReaction = addReaction;
// DELETE a reaction from a thought
const removeReaction = async (req, res) => {
    try {
        const thought = await thots_1.default.findByIdAndUpdate(req.params.thoughtId, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { new: true });
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        console.log(`[DELETE /thoughts/${req.params.thoughtId}/reactions/${req.params.reactionId}] Reaction removed`);
        res.json(thought);
    }
    catch (err) {
        console.error(`[ERROR DELETE /thoughts/${req.params.thoughtId}/reactions/${req.params.reactionId}]`, err);
        res.status(500).json({ error: 'Failed to remove reaction' });
    }
};
exports.removeReaction = removeReaction;
