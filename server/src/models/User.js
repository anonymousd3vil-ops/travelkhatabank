import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'manager', 'member'], default: 'user' },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
