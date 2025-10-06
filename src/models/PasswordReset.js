import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
  },
  used: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for automatic cleanup of expired tokens
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset = mongoose.models.PasswordReset || mongoose.model('PasswordReset', passwordResetSchema);

export default PasswordReset;