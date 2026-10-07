import Trip from '../models/Trip.js';

// Loads :id trip, ensures the user belongs to it, flags manager.
export const loadTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('members', 'name phone username role');
    if (!trip || !trip.members.some((m) => String(m._id) === String(req.user._id)))
      return res.status(404).json({ message: 'Trip not found' });
    req.trip = trip;
    req.isManager = String(trip.manager) === String(req.user._id);
    next();
  } catch {
    res.status(404).json({ message: 'Trip not found' });
  }
};

export const tripManager = (req, res, next) =>
  req.isManager ? next() : res.status(403).json({ message: 'Only the Expense Manager can do this' });
