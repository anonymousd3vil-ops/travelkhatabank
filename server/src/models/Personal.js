import mongoose from 'mongoose';

const personalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['expense', 'income'], default: 'expense' },
  title: { type: String, required: true, trim: true },
  category: { type: String, default: 'Other' },
  amount: { type: Number, required: true, min: 0.01 },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Personal', personalSchema);
