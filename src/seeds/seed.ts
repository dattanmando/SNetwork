import mongoose from 'mongoose';
import User from '../models/User';
import Thought from '../models/thots';

const MONGO_URI = 'mongodb://127.0.0.1:27017/SNetwork';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    // Clear old data
    await User.deleteMany({});
    await Thought.deleteMany({});
    console.log('[Seed] Old data cleared');

    // Create a test user
    const user = await User.create({
      username: 'Kyle Johnson',
      email: 'KJ@gmail.com',
    });

    console.log('[Seed] User created:', user);

    // Optional: create a test thought
    const thought = await Thought.create({
      thoughtText: 'This is my first seeded thought!',
      username: user.username
    });

    // Push thought to user
    user.thoughts.push(thought._id);
    await user.save();

    console.log('[Seed] Thought created and linked to user:', thought);

    console.log('[Seed] Done ✅');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error seeding data:', err);
    process.exit(1);
  }
};

seed();