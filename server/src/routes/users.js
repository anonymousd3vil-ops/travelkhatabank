import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Trip from '../models/Trip.js';
import Entry from '../models/Entry.js';
import wrap from '../utils/asyncHandler.js';
import { spentByUser } from '../utils/spend.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
const round = (n) => Math.round(n * 100) / 100;

// Profile: trips travelled with my share and the trip's total spend
router.get('/me/profile', wrap(async (req, res) => {
  const me = String(req.user._id);
  const trips = await Trip.find({ members: req.user._id }).sort({ createdAt: -1 });
  const entries = await Entry.find({ trip: { $in: trips.map((t) => t._id) }, voided: false, type: 'debit' });
  const rows = trips.map((t) => {
    const es = entries.filter((e) => String(e.trip) === String(t._id));
    return {
      id: t._id, destination: t.destination, heads: t.members.length, perHead: t.perHead, createdAt: t.createdAt,
      isManager: String(t.manager) === me,
      myShare: round(spentByUser(es)[me] || 0), tripTotal: round(es.reduce((a, e) => a + e.amount, 0)),
    };
  });
  const { name, username, phone, createdAt } = req.user;
  res.json({
    user: { name, username, phone, joined: createdAt }, trips: rows,
    totalShare: round(rows.reduce((a, r) => a + r.myShare, 0)), tripsManaged: rows.filter((r) => r.isManager).length,
  });
}));

router.put('/me', wrap(async (req, res) => {
  const { name, phone } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
  req.user.name = name.trim();
  req.user.phone = phone?.trim();
  await req.user.save();
  res.json({ name: req.user.name, phone: req.user.phone });
}));

router.put('/me/password', wrap(async (req, res) => {
  const { current, next } = req.body;
  if (!(await bcrypt.compare(current || '', req.user.password))) return res.status(400).json({ message: 'Current password is wrong' });
  if (!next || next.length < 6) return res.status(400).json({ message: 'New password must be 6+ characters' });
  req.user.password = await bcrypt.hash(next, 10);
  await req.user.save();
  res.json({ ok: true });
}));

export default router;
