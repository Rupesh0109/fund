const express = require('express');
const multer = require('multer');
const path = require('path');
const Campaign = require('../models/Campaign');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const sendCampaignSubmissionEmail = require('../utils/mailer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const PaidUser = require('../models/PaidUser');

router.post('/', authMiddleware, upload.fields([
  { name: 'idDoc', maxCount: 1 },
  { name: 'billDoc', maxCount: 1 },
  { name: 'campaignDoc', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]), async (req, res) => {
  try {
    // Fetch an unused payment record for the user
    const paidUser = await PaidUser.findOne({ email: req.user.email, used: false });
    if (!paidUser) {
      return res.status(400).json({ message: 'No unused paid plan found for user. Please purchase a plan first.' });
    }

    // Check if user already has a campaign linked to this payment
    const existingCampaign = await Campaign.findOne({ user: req.user.id, paidUserId: paidUser._id, status: { $in: ['pending', 'approved'] } });
    if (existingCampaign) {
      return res.status(400).json({ message: `You already have a ${paidUser.plan} campaign. Please complete or cancel it before submitting a new one.` });
    }

    const plan = paidUser.plan;
    let videoLink = '';
    if (paidUser.plan === 'standard' || paidUser.plan === 'video') {
      videoLink = req.body.videoLink || '';
    }

    console.log("Received files:", req.files);
    const {
      fullName, email, role, beneficiaryName, goalAmount, donationLink
    } = req.body;

    const campaign = new Campaign({
      user: req.user.id,
      paidUserId: paidUser._id,
      fullName,
      email,
      role,
      beneficiaryName,
      goalAmount,
      donationLink,
      plan,
      videoLink,
      status: 'pending', // set initial status to pending
      files: {
        idDoc: req.files['idDoc']?.[0]?.filename || '',
        billDoc: req.files['billDoc']?.[0]?.filename || '',
        campaignDoc: req.files['campaignDoc']?.[0]?.filename || '',
        image: req.files['image']?.[0]?.filename || '',
      },
    });

    console.log("Saving campaign with files:", campaign.files);

   await campaign.save();
paidUser.used = true;
await paidUser.save();

// ✅ Prepare attachment paths
const filePaths = {
  idDoc: campaign.files.idDoc && path.join(__dirname, '..', 'uploads', campaign.files.idDoc),
  billDoc: campaign.files.billDoc && path.join(__dirname, '..', 'uploads', campaign.files.billDoc),
  campaignDoc: campaign.files.campaignDoc && path.join(__dirname, '..', 'uploads', campaign.files.campaignDoc),
  image: campaign.files.image && path.join(__dirname, '..', 'uploads', campaign.files.image),
};
res.json({ message: 'Campaign submitted successfully', campaign });
// ✅ Send email to admin
try {
  
  await sendCampaignSubmissionEmail(
    process.env.NOTIFY_RECEIVER_EMAIL,
    campaign,
    filePaths
  );
  console.log(`📧 Email sent for campaign: ${campaign.fullName}`);
} catch (err) {
  console.error('❌ Email sending failed:', err);
}


    
  } catch (err) {
    console.error("Campaign submission error:", err);
    res.status(500).json({ message: 'Submission failed', error: err.message });
  }
});

// GET all campaigns (admin only)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const campaigns = await Campaign.find().populate('user', 'name email');
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch campaigns', error: err.message });
  }
});

// PATCH approve/reject campaign (admin only)
router.patch('/:id/approve', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    res.json({ message: 'Campaign approved', campaign });
  } catch (err) {
    res.status(500).json({ message: 'Approval failed', error: err.message });
  }
});

router.patch('/:id/reject', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    res.json({ message: 'Campaign rejected', campaign });
  } catch (err) {
    res.status(500).json({ message: 'Rejection failed', error: err.message });
  }
});
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id });
    if (!campaigns || campaigns.length === 0) return res.status(404).json({ message: 'No campaigns found' });
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;