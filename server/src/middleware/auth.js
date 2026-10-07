import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import wrap from '../utils/asyncHandler.js';

export const protect = wrap(async (req, res, next) => {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorised' });
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id);
  } catch {
    return res.status(401).json({ message: 'Session expired, please login again' });
  }
  if (!req.user) return res.status(401).json({ message: 'Not authorised' });
  next();
});

export const managerOnly = (req, res, next) =>
  req.user.role === 'manager' ? next() : res.status(403).json({ message: 'Only the Expense Manager can do this' });
