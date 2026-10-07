import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import entryRoutes from './routes/entries.js';
import personalRoutes from './routes/personal.js';
import userRoutes from './routes/users.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('dev')); // request status log in the terminal

app.use('/api/auth', authRoutes);
app.use('/api/trips/:id/entries', entryRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

await connectDB();
app.listen(process.env.PORT || 5000, () => console.log('API running'));
