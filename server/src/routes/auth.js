import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import wrap from '../utils/asyncHandler.js';

const router = Router();
const session = (u) => ({
  token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: { id: u._id, name: u.name, username: u.username, role: u.role },
});

router.post('/register', wrap(async (req, res) => {
  const { name, username, password, phone } = req.body;
  if (!name || !username || !password || password.length < 6)
    return res.status(400).json({ message: 'Name, username and a password of 6+ characters are required' });
  if (await User.findOne({ username: username.toLowerCase() }))
    return res.status(409).json({ message: 'Username already taken' });
  const user = await User.create({ name, phone, username, password: await bcrypt.hash(password, 10) });
  res.status(201).json(session(user));
}));

router.post('/login', wrap(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: (username || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password)))
    return res.status(401).json({ message: 'Invalid username or password' });
  res.json(session(user));
}));

export default router;
