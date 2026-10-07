import { Router } from 'express';
import Personal from '../models/Personal.js';
import wrap from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', wrap(async (req, res) => res.json(await Personal.find({ user: req.user._id }).sort({ date: -1 }))));

router.post('/', wrap(async (req, res) => {
  const { type, title, amount, category } = req.body;
  if (!title?.trim() || !(amount > 0)) return res.status(400).json({ message: 'Title and a valid amount are required' });
  res.status(201).json(await Personal.create({ user: req.user._id, type, title, amount, category }));
}));

router.delete('/:id', wrap(async (req, res) => {
  await Personal.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ id: req.params.id });
}));

export default router;
