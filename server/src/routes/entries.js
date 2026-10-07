import { Router } from 'express';
import Entry from '../models/Entry.js';
import wrap from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.js';
import { loadTrip, tripManager } from '../middleware/tripAccess.js';

const router = Router({ mergeParams: true });
router.use(protect, loadTrip);
const populate = [{ path: 'participants', select: 'name' }, { path: 'createdBy', select: 'name' }, { path: 'shares.user', select: 'name' }];
const bad = (res, message) => res.status(400).json({ message });

router.get('/', wrap(async (req, res) => {
  res.json(await Entry.find({ trip: req.trip._id }).sort({ createdAt: -1 }).populate(populate));
}));

router.post('/', tripManager, wrap(async (req, res) => {
  const { type, title, category, participants = [], shares = [] } = req.body;
  const amount = Number(req.body.amount);
  if (!title?.trim() || !(amount > 0) || !['debit', 'credit'].includes(type)) return bad(res, 'Description and a valid amount are required');
  const ids = req.trip.members.map((m) => String(m._id));
  let list = [];
  if (type === 'debit') {
    if (shares.length) { // custom split
      list = shares.map((s) => ({ user: s.user, amount: Number(s.amount) }));
      if (list.some((s) => !ids.includes(String(s.user)) || !(s.amount >= 0))) return bad(res, 'Invalid member in shares');
      if (Math.abs(list.reduce((a, s) => a + s.amount, 0) - amount) > 0.01) return bad(res, 'Shares must add up to the amount');
    } else { // equal split (default)
      if (!participants.length || participants.some((p) => !ids.includes(String(p)))) return bad(res, 'Select the members involved in this spend');
      const base = Math.floor((amount * 100) / participants.length) / 100;
      list = participants.map((u, i) => ({ user: u, amount: i === participants.length - 1 ? Math.round((amount - base * (participants.length - 1)) * 100) / 100 : base }));
    }
  }
  const entry = await Entry.create({
    trip: req.trip._id, type, title, amount, category,
    participants: list.map((s) => s.user), shares: list, createdBy: req.user._id,
  });
  res.status(201).json(await entry.populate(populate));
}));

// Entries are never deleted, only voided, so the log stays traceable.
router.patch('/:eid/void', tripManager, wrap(async (req, res) => {
  const entry = await Entry.findOne({ _id: req.params.eid, trip: req.trip._id });
  if (!entry) return res.status(404).json({ message: 'Entry not found' });
  entry.voided = true;
  entry.voidedAt = new Date();
  await entry.save();
  res.json(await entry.populate(populate));
}));

export default router;
