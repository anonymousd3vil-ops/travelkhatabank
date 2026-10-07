import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import Entry from '../models/Entry.js';
import wrap from '../utils/asyncHandler.js';
import { spentByUser } from '../utils/spend.js';
import { protect } from '../middleware/auth.js';
import { loadTrip, tripManager } from '../middleware/tripAccess.js';

const router = Router();
router.use(protect);
const round = (n) => Math.round(n * 100) / 100;
const makeUsername = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) + crypto.randomInt(1000, 9999);
const makePassword = () => crypto.randomBytes(4).toString('hex');

// Create trip. Each traveller is either an existing account (username) or a new one with generated login.
router.post('/', wrap(async (req, res) => {
  const { destination, perHead, members = [] } = req.body;
  if (!destination || !(perHead > 0) || !members.length)
    return res.status(400).json({ message: 'Destination, per head amount and at least one more traveller are required' });

  const ids = [String(req.user._id)];
  const docs = [];
  const credentials = [];
  for (const m of members) {
    if (m.username?.trim()) {
      const u = await User.findOne({ username: m.username.trim().toLowerCase() });
      if (!u) return res.status(400).json({ message: `No account found with username "${m.username}"` });
      if (!ids.includes(String(u._id))) ids.push(String(u._id));
      continue;
    }
    if (!m.name?.trim() || !m.phone?.trim())
      return res.status(400).json({ message: 'Every traveller needs a name and contact number' });
    const username = makeUsername(m.name);
    const password = makePassword();
    credentials.push({ name: m.name.trim(), phone: m.phone.trim(), username, password });
    docs.push({ name: m.name.trim(), phone: m.phone.trim(), username, password: await bcrypt.hash(password, 10), role: 'member' });
  }
  const created = await User.insertMany(docs);
  const trip = await Trip.create({ destination, perHead, manager: req.user._id, members: [...ids, ...created.map((u) => u._id)] });
  res.status(201).json({ trip, credentials });
}));

// All trips this user belongs to
router.get('/', wrap(async (req, res) => {
  const trips = await Trip.find({ members: req.user._id }).sort({ createdAt: -1 });
  res.json(trips.map((t) => ({
    id: t._id, destination: t.destination, perHead: t.perHead, heads: t.members.length,
    isManager: String(t.manager) === String(req.user._id), createdAt: t.createdAt,
  })));
}));

// Trip + live money summary
router.get('/:id', loadTrip, wrap(async (req, res) => {
  const { trip, isManager } = req;
  const entries = await Entry.find({ trip: trip._id, voided: false });
  const heads = trip.members.length;
  const credits = entries.filter((e) => e.type === 'credit').reduce((a, e) => a + e.amount, 0);
  const debits = entries.filter((e) => e.type === 'debit').reduce((a, e) => a + e.amount, 0);
  const spent = spentByUser(entries);
  const fund = trip.perHead * heads;
  const contributed = trip.perHead + credits / heads;
  const members = trip.members.map((m) => ({
    id: m._id, name: m.name, phone: m.phone,
    username: isManager ? m.username : undefined,
    contributed: round(contributed), spent: round(spent[m._id] || 0), remaining: round(contributed - (spent[m._id] || 0)),
  }));
  res.json({
    trip: { id: trip._id, destination: trip.destination, perHead: trip.perHead, manager: String(trip.manager), heads },
    summary: { fund, credits: round(credits), debits: round(debits), balance: round(fund + credits - debits), members },
  });
}));

// Reset a generated member's password (only if they belong to this trip alone)
router.post('/:id/reset/:uid', loadTrip, tripManager, wrap(async (req, res) => {
  const member = req.trip.members.find((m) => String(m._id) === req.params.uid && m.role === 'member');
  if (!member || (await Trip.countDocuments({ members: member._id })) > 1)
    return res.status(400).json({ message: 'Password can only be reset for members who are only in this trip' });
  const password = makePassword();
  await User.findByIdAndUpdate(member._id, { password: await bcrypt.hash(password, 10) });
  res.json({ username: member.username, password });
}));

export default router;
