const express = require('express');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const Campaign = require('../models/Campaign');

const router = express.Router();

// Route to serve uploaded files with authorization
router.get('/:filename', authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const user = req.user;

    // Find campaign that contains the file
    const campaign = await Campaign.findOne({
      $or: [
        { 'files.idDoc': filename },
        { 'files.billDoc': filename },
        { 'files.campaignDoc': filename },
        { 'files.image': filename }
      ]
    });

    if (!campaign) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if user is admin or owner of the campaign
    if (user.role !== 'admin' && campaign.user.toString() !== user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Stream the file content
    const stat = fs.statSync(filePath);
    const mime = require('mime-types');
    const contentType = mime.lookup(filePath) || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } catch (err) {
    console.error('Error serving file:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
