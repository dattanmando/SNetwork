import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import thoughtRoutes from './routes/thoughtRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Social Network API!');
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/SNetwork')
  .then(() => {
    console.log('[MongoDB] Connected!');
    app.listen(PORT, () => console.log(`[Server] Listening on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('[MongoDB] Connection error:', err));
