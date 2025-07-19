import React from "react";

const About = () => {
  return (
    <div className="bg-[#0C1023] text-white min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-purple-400">About Us – Notipfundraiser</h1>

        <p>
          At <strong>Notipfundraiser</strong>, we believe in making fundraising simple, transparent, and donor-friendly.
          Our mission is to empower individuals and organizations with a fully customized fundraising template that
          focuses entirely on your cause—not ours. We don’t ask for tips. We don’t set high “suggested donations.”
          And we don’t create barriers between you and the people who want to support you. You don’t require a domain or a website.
        </p>

        <h2 className="text-2xl font-semibold text-purple-300">What Makes Us Different?</h2>
        <p>
          Unlike mainstream platforms that pressure supporters into tipping 15% or more, we put every dollar back into your hands.
          We don’t push absurd donation suggestions that might scare away smaller contributors.
        </p>
        <p>
          With our platform, you receive a clean, beautiful, functional donation webpage—complete with your images, optional videos, and the exact message you want to convey.
          We even offer 2 customizable templates to choose from for sharing on social media.
        </p>

        <h2 className="text-2xl font-semibold text-purple-300">A Custom Fundraising Template Built for You</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Your message, your way: Add photos, videos, text, and updates.</li>
          <li>Direct payment link: Donations go directly to your PayPal or Stripe account.</li>
          <li>Shareable link: Works on all major platforms like Facebook, Instagram, X, LinkedIn.</li>
          <li>No tipping prompt: We never ask donors to tip us.</li>
          <li>No “suggested” donation pressure: Donors give what they can—without guilt.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-purple-300">Why Tips and Suggested Amounts Hurt Your Campaign</h2>
        <p>
          Large suggested donations often discourage small donors. At Notipfundraiser, we ensure no pressure, no guilt—only support.
        </p>

        <h2 className="text-2xl font-semibold text-purple-300">No Marketing? No Problem.</h2>
        <p>
          Unlike other platforms that leave you to fend for yourself, we offer campaign support to help you gain visibility.
          Your page is more than a form—it’s a tool built to inspire trust and conversions.
        </p>

        <h2 className="text-2xl font-semibold text-purple-300">We’re Redefining Online Fundraising</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Mobile-optimized donation pages</li>
          <li>Media-rich design</li>
          <li>Zero platform fees</li>
          <li>Zero tipping pressure</li>
          <li>No inflated donation suggestions</li>
          <li>Direct transfers via PayPal or Stripe</li>
          <li>Transparent, donor-friendly experience</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">Get Started Today</h2>
        <p>
          Whether you’re fundraising for a personal cause, community project, or nonprofit mission, we’re here to simplify and empower.
          Your donors deserve to know that <strong>100%*</strong> of their contribution (less payment processor fees) is going directly to YOU.
        </p>

        <p className="text-sm text-gray-400 mt-4 text-center">*100% less payment processing fees.</p>
      </div>
    </div>
  );
};

export default About;
