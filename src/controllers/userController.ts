import { Request, Response } from 'express';
import User from '../models/User';
import Thought from '../models/thots';

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().populate('friends').populate('thoughts');
    console.log('[GET /users] Retrieved all users');
    res.json(users);
  } catch (err) {
    console.error('[ERROR GET /users]', err);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

// Get a single user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('friends')
      .populate('thoughts');
    
    if (!user) {
      console.log(`[GET /users/${req.params.id}] User not found`);
       res.status(404).json({ message: 'User not found' });
    }

    console.log(`[GET /users/${req.params.id}] Found user`);
    res.json(user);
  } catch (err) {
    console.error(`[ERROR GET /users/${req.params.id}]`, err);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    console.log('[POST /users] Created new user:', user.username);
    res.status(201).json(user);
  } catch (err) {
    console.error('[ERROR POST /users]', err);
    res.status(400).json({ error: 'Failed to create user' });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      console.log(`[PUT /users/${req.params.id}] User not found`);
       res.status(404).json({ message: 'User not found' });
    }

    console.log(`[PUT /users/${req.params.id}] Updated user`);
    res.json(user);
  } catch (err) {
    console.error(`[ERROR PUT /users/${req.params.id}]`, err);
    res.status(400).json({ error: 'Failed to update user' });
  }
};

// Delete a user and optionally their thoughts (Bonus!)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      console.log(`[DELETE /users/${req.params.id}] User not found`);
       res.status(404).json({ message: 'User not found' });
       return; // Added return to prevent further execution
    }

    // BONUS: Delete their thoughts too
    await Thought.deleteMany({ _id: { $in: user.thoughts } });

    console.log(`[DELETE /users/${req.params.id}] Deleted user and their thoughts`);
    res.json({ message: 'User and associated thoughts deleted' });
  } catch (err) {
    console.error(`[ERROR DELETE /users/${req.params.id}]`, err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Add a friend
export const addFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );

    if (!user) {
      console.log(`[POST /users/${req.params.userId}/friends/${req.params.friendId}] User not found`);
       res.status(404).json({ message: 'User not found' });
    }

    console.log(`[POST /users/${req.params.userId}/friends/${req.params.friendId}] Added friend`);
    res.json(user);
  } catch (err) {
    console.error(`[ERROR POST /users/${req.params.userId}/friends/${req.params.friendId}]`, err);
    res.status(500).json({ error: 'Failed to add friend' });
  }
};

// Remove a friend
export const removeFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );

    if (!user) {
      console.log(`[DELETE /users/${req.params.userId}/friends/${req.params.friendId}] User not found`);
       res.status(404).json({ message: 'User not found' });
    }

    console.log(`[DELETE /users/${req.params.userId}/friends/${req.params.friendId}] Removed friend`);
    res.json(user);
  } catch (err) {
    console.error(`[ERROR DELETE /users/${req.params.userId}/friends/${req.params.friendId}]`, err);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
};