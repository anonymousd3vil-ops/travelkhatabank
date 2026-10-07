import mongoose from 'mongoose';

// One ledger line. debit = group spend, credit = money added to the pool.
const entrySchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
  type: { type: String, enum: ['debit', 'credit'], required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, default: 'Other' },
  amount: { type: Number, required: true, min: 0.01 },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shares: [{ _id: false, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, amount: Number }], // who owes how much
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voided: { type: Boolean, default: false },
  voidedAt: Date,
}, { timestamps: true });

export default mongoose.model('Entry', entrySchema);
