import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import FileViewer from '../components/FileViewer';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [user, setUser] = useState(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/auth/me');
        setUser(userRes.data.user);

        const paidRes = await api.post('/stripe/check-paid', {
          email: userRes.data.user.email,
        });
        setPaid(paidRes.data.paid);

        const campaignRes = await api.get('/campaign/my');
        setCampaigns(campaignRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const campaignRes = await api.get('/campaign/my');
      setCampaigns(campaignRes.data);
    } catch (err) {
      console.error('Error refreshing campaign data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="bg-[#0C1023] min-h-screen text-white p-6">Loading...</div>;

  return (
    <div className="bg-[#0C1023] min-h-screen text-white py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          📊 <span>Dashboard</span>
        </h1>

        {user && (
          <div className="bg-[#151a33] p-5 rounded-lg shadow mb-6">
            <p className="mb-1"><span className="font-semibold text-gray-400">Name:</span> {user.name}</p>
            <p className="mb-1"><span className="font-semibold text-gray-400">Email:</span> {user.email}</p>
            <p className="mb-1"><span className="font-semibold text-gray-400">Paid:</span> <span className={paid ? 'text-green-400' : 'text-red-400'}>{paid ? 'Yes' : 'No'}</span></p>
            <p className="mb-4"><span className="font-semibold text-gray-400">Campaign Submitted:</span> {campaigns.length > 0 ? 'Yes' : 'No'}</p>
            <button
              onClick={refreshData}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded text-white font-medium hover:opacity-90"
            >
              🔄 Refresh
            </button>
          </div>
        )}

        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-[#1b1e39] p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">Your Campaign</h2>
              <div className="space-y-2">
                <p><strong className="text-gray-400">Full Name:</strong> {campaign.fullName}</p>
                <p><strong className="text-gray-400">Email:</strong> {campaign.email}</p>
                <p><strong className="text-gray-400">Role:</strong> {campaign.role}</p>
                {campaign.beneficiaryName && (
                  <p><strong className="text-gray-400">Beneficiary:</strong> {campaign.beneficiaryName}</p>
                )}
                <p><strong className="text-gray-400">Goal Amount:</strong> ${campaign.goalAmount}</p>
                <p>
                  <strong className="text-gray-400">Donation Link:</strong>{' '}
                  <a className="text-blue-400 underline" href={campaign.donationLink} target="_blank" rel="noreferrer">
                    {campaign.donationLink}
                  </a>
                </p>
                {campaign.videoLink && (
                  <p>
                    <strong className="text-gray-400">Video Link:</strong>{' '}
                    <a className="text-blue-400 underline" href={campaign.videoLink} target="_blank" rel="noreferrer">
                      {campaign.videoLink}
                    </a>
                  </p>
                )}
                <p>
                  <strong className="text-gray-400">Status:</strong>{' '}
                  <span className="text-yellow-400">{campaign.status}</span>
                </p>
              </div>

              <div className="mt-4">
                <p className="font-semibold text-gray-300 mb-2">Uploaded Documents:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>
                    <FileViewer
                      fileUrl={`http://localhost:5000/api/uploads/${campaign.files.idDoc}`}
                      fileName="ID Document"
                    >
                      ID Document
                    </FileViewer>
                  </li>
                  <li>
                    <FileViewer
                      fileUrl={`http://localhost:5000/api/uploads/${campaign.files.billDoc}`}
                      fileName="Utility Bill"
                    >
                      Utility Bill
                    </FileViewer>
                  </li>
                  <li>
                    <FileViewer
                      fileUrl={`http://localhost:5000/api/uploads/${campaign.files.campaignDoc}`}
                      fileName="Campaign Word Doc"
                    >
                      Campaign Word Doc
                    </FileViewer>
                  </li>
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">You haven’t submitted any campaign yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
