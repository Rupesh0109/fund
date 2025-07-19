const mongoose = require('mongoose');
const PaidUserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  paidAt: { type: Date },
  plan: { type: String },
  used: { type: Boolean, default: false },
  stripeCustomerId: String,
  sessionId: String
});
module.exports = mongoose.model('PaidUser', PaidUserSchema);