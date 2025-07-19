import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import FileViewer from '../components/FileViewer';

const CampaignForm = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    plan: '',
    role: '',
    beneficiaryName: '',
    goalAmount: '',
    donationLink: '',
    videoLink: '',
    liabilityAgreement: false,
    privacyPolicy: false,
    serviceAgreement: false,
  });

  const [files, setFiles] = useState({
    idDoc: null,
    billDoc: null,
    campaignDoc: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAccess = async () => {
      try {
        const res = await api.get('/auth/me');
        const email = res.data.user.email;
        const check = await api.post('/stripe/check-paid', { email });

        if (check.data.paid) {
          setIsLoggedIn(true);
          const plan = (check.data.plan || '').toLowerCase();
          setForm((prev) => ({ ...prev, email, plan }));
        } else {
          alert('🚫 You must purchase a plan first.');
          navigate('/pricing');
        }
      } catch (err) {
        alert('Something went wrong. Please login again.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchAccess();
  }, [navigate]);

  if (loading) return <div className="bg-[#0C1023] min-h-screen text-white p-6">Loading...</div>;
  if (!isLoggedIn) return null;

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.liabilityAgreement || !form.privacyPolicy || !form.serviceAgreement) {
      alert('You must agree to all the agreements before submitting.');
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    Object.entries(files).forEach(([key, value]) => data.append(key, value));

    try {
      await api.post('/campaign', data);
      setSuccess(true);
      navigate('/dashboard');
    } catch (err) {
      alert('Submission failed');
    }
  };

  return (
    <div className="bg-[#0C1023] min-h-screen text-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-purple-300">📋 Register Your Campaign</h1>

        {success ? (
          <p className="text-green-400">✅ Submitted! You’ll receive links in 24–48 hrs.</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 bg-[#151a33] p-6 rounded-lg shadow">
            <input
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="p-3 rounded bg-[#1e2440] border border-gray-600 text-white"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              readOnly
              className="p-3 rounded bg-[#1e2440] border border-gray-600 text-white cursor-not-allowed"
            />
            <select
              name="role"
              onChange={handleChange}
              required
              className="p-3 rounded bg-[#1e2440] border border-gray-600 text-white"
            >
              <option value="">Select Role</option>
              <option value="author">Author</option>
              <option value="beneficiary">Beneficiary</option>
              <option value="both">Both</option>
            </select>

            {form.role === 'author' && (
              <input
                name="beneficiaryName"
                placeholder="Beneficiary Name"
                onChange={handleChange}
                required
                className="p-3 rounded bg-[#1e2440] border border-gray-600 text-white"
              />
            )}

            <input
              name="goalAmount"
              type="number"
              placeholder="Goal Amount (USD)"
              onChange={handleChange}
              required
              className="p-3 rounded bg-[#1e2440] border border-gray-600 text-white"
            />
            <input
              name="donationLink"
              type="url"
              placeholder="Donation Link"
              onChange={handleChange}
              required
              className="p-3 rounded bg-[#1e2440] border border-gray-600 text-white"
            />

            {(form.plan === 'standard' || form.plan === 'video') && (
              <input
                name="videoLink"
                type="url"
                placeholder="Video Link"
                onChange={handleChange}
                required
                className="p-3 rounded bg-[#1e2440] border border-gray-600 text-white"
              />
            )}

            {/* File Uploads */}
            <div>
              <label>ID Document:</label>
              <input name="idDoc" type="file" accept=".pdf,.jpg,.png" onChange={handleFile} required className="mt-1" />
            </div>
            <div>
              <label>Utility Bill:</label>
              <input name="billDoc" type="file" accept=".pdf,.jpg,.png" onChange={handleFile} required className="mt-1" />
            </div>
            <div>
              <label>Campaign Document (.pdf):</label>
              <input name="campaignDoc" type="file" accept=".pdf" onChange={handleFile} required className="mt-1" />
            </div>

            {/* Agreements */}
            <div className="space-y-3 text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="liabilityAgreement"
                  checked={form.liabilityAgreement}
                  onChange={handleChange}
                />
                <span>
                  I agree to the Liability Indemnity Agreement (
                  <FileViewer fileUrl="/agreements/liablity.pdf" fileName="Liability Agreement" />)
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="privacyPolicy"
                  checked={form.privacyPolicy}
                  onChange={handleChange}
                />
                <span>
                  I agree to the Privacy Policy (
                  <FileViewer fileUrl="/agreements/privacy.pdf" fileName="Privacy Policy" />)
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="serviceAgreement"
                  checked={form.serviceAgreement}
                  onChange={handleChange}
                />
                <span>
                  I agree to the Service Agreement (
                  <FileViewer fileUrl="/agreements/service.pdf" fileName="Service Agreement" />)
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-2 rounded hover:opacity-90"
            >
              🚀 Submit Registration
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CampaignForm;
