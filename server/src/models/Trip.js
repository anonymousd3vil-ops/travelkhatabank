import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  destination: { type: String, required: true, trim: true },
  perHead: { type: Number, required: true, min: 1 },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // includes the manager
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);
