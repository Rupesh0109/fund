const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465, // use 587 if you prefer TLS
  secure: true, // true for port 465, false for 587
  auth: {
  user: process.env.NOTIFY_EMAIL,
  pass: process.env.NOTIFY_EMAIL_PASS,
}
});

async function sendCampaignSubmissionEmail(to, campaign, filePaths) {
  const attachments = [];

  for (const [label, filepath] of Object.entries(filePaths)) {
    if (filepath && fs.existsSync(filepath) && fs.lstatSync(filepath).isFile()) {
      attachments.push({
        filename: `${label}-${path.basename(filepath)}`,
        path: filepath,
        contentType: 'application/octet-stream',
      });
    }
  }

  const html = `
    <h2>New Campaign Submission</h2>
    <p><strong>Full Name:</strong> ${campaign.fullName}</p>
    <p><strong>Email:</strong> ${campaign.email}</p>
    <p><strong>Role:</strong> ${campaign.role}</p>
    <p><strong>Beneficiary:</strong> ${campaign.beneficiaryName || 'N/A'}</p>
    <p><strong>Goal Amount:</strong> ${campaign.goalAmount}</p>
    <p><strong>Donation Link:</strong> ${campaign.donationLink}</p>
    ${campaign.videoLink ? `<p><strong>Video Link:</strong> ${campaign.videoLink}</p>` : ''}
    <p><strong>Plan:</strong> ${campaign.plan}</p>
    <p>Attached are the uploaded documents.</p>
  `;

  await transporter.sendMail({
    from: `"No Tip Fundraiser" <${process.env.NOTIFY_EMAIL}>`,
    to,
    subject: `📥 New Campaign Submission: ${campaign.fullName}`,
    html,
    attachments,
  });
}

module.exports = sendCampaignSubmissionEmail;
