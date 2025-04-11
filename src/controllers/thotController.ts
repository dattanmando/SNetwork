import { Request, Response } from 'express';
import Thought from '../models/thots';
import User from '../models/User';

// GET all thoughts
export const getThoughts = async (_req: Request, res: Response) => {
  try {
    const thoughts = await Thought.find();
    console.log('[GET /thoughts] All thoughts fetched');
    res.json(thoughts);
  } catch (err) {
    console.error('[ERROR GET /thoughts]', err);
    res.status(500).json({ error: 'Failed to fetch thoughts' });
  }
};

// GET single thought by ID
export const getThoughtById = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    console.log(`[GET /thoughts/${req.params.id}] Thought fetched`);
    res.json(thought);
  } catch (err) {
    console.error(`[ERROR GET /thoughts/${req.params.id}]`, err);
    res.status(500).json({ error: 'Failed to fetch thought' });
  }
};

// POST create a new thought + push to user's thoughts
export const createThought = async (req: Request, res: Response) => {
  try {
    const { thoughtText, username, userId } = req.body;

    const thought = await Thought.create({ thoughtText, username });

    // Push thought to user
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { thoughts: thought._id } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: 'User not found to attach thought' });
      return;
    }

    console.log(`[POST /thoughts] Thought created by ${username}`);
    res.status(201).json(thought);
  } catch (err) {
    console.error('[ERROR POST /thoughts]', err);
    res.status(500).json({ error: 'Failed to create thought' });
  }
};

// PUT update a thought
export const updateThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    console.log(`[PUT /thoughts/${req.params.id}] Thought updated`);
    res.json(thought);
  } catch (err) {
    console.error(`[ERROR PUT /thoughts/${req.params.id}]`, err);
    res.status(500).json({ error: 'Failed to update thought' });
  }
};

// DELETE a thought
export const deleteThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);

    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    console.log(`[DELETE /thoughts/${req.params.id}] Thought deleted`);
    res.json({ message: 'Thought deleted successfully' });
  } catch (err) {
    console.error(`[ERROR DELETE /thoughts/${req.params.id}]`, err);
    res.status(500).json({ error: 'Failed to delete thought' });
  }
};

// POST a reaction to a thought
export const addReaction = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    );

    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    console.log(`[POST /thoughts/${req.params.thoughtId}/reactions] Reaction added`);
    res.json(thought);
  } catch (err) {
    console.error(`[ERROR POST /thoughts/${req.params.thoughtId}/reactions]`, err);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
};

// DELETE a reaction from a thought
export const removeReaction = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );

    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    console.log(`[DELETE /thoughts/${req.params.thoughtId}/reactions/${req.params.reactionId}] Reaction removed`);
    res.json(thought);
  } catch (err) {
    console.error(`[ERROR DELETE /thoughts/${req.params.thoughtId}/reactions/${req.params.reactionId}]`, err);
    res.status(500).json({ error: 'Failed to remove reaction' });
  }
};
