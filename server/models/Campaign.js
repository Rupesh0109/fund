const mongoose = require('mongoose');
const CampaignSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: String,
  email: String,
  role: String,
  beneficiaryName: String,
  goalAmount: Number,
  donationLink: String,
  plan: { type: String, enum: ['basic', 'standard', 'video'], required: true },
  videoLink: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  files: {
    idDoc: String,
    billDoc: String,
    campaignDoc: String,
    image: String,
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Campaign', CampaignSchema);
