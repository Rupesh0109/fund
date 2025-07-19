import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import FileViewer from '../components/FileViewer';

const AdminPanel = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/campaign/all');
        setCampaigns(res.data);
      } catch (err) {
        console.error('Error loading campaigns');
      }
    };
    fetchAll();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      if (status === 'approved') {
        await api.patch(`/campaign/${id}/approve`);
      } else if (status === 'rejected') {
        await api.patch(`/campaign/${id}/reject`);
      }
      setCampaigns(campaigns.map(c => c._id === id ? { ...c, status } : c));
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-lg shadow-2xl text-white font-sans">
      <h1 className="text-5xl font-extrabold mb-8 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500">
        Admin Panel
      </h1>
      {campaigns.length === 0 ? (
        <p className="text-pink-300 text-xl">No campaigns found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-purple-700 shadow-lg">
          <table className="min-w-full divide-y divide-purple-700">
            <thead className="bg-gradient-to-r from-pink-700 via-purple-800 to-indigo-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Goal</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Video Link</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Files</th>
            </tr>
            </thead>
            <tbody className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 divide-y divide-purple-700">
              {campaigns.map((c) => (
                <tr key={c._id} className="hover:bg-gradient-to-r hover:from-pink-600 hover:via-purple-700 hover:to-indigo-800 transition duration-300">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{c.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{c.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${c.goalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{c.plan || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{c.videoLink || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.status === 'approved' ? 'bg-green-500 text-green-900' :
                      c.status === 'rejected' ? 'bg-red-500 text-red-900' :
                      'bg-yellow-400 text-yellow-900'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button onClick={() => updateStatus(c._id, 'approved')} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow-lg transition duration-200">Approve</button>
                    <button onClick={() => updateStatus(c._id, 'rejected')} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition duration-200">Reject</button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-y-2">
                    <FileViewer fileUrl={`http://localhost:5000/api/uploads/${c.files.idDoc}`} fileName="ID Document">ID</FileViewer>
                    <FileViewer fileUrl={`http://localhost:5000/api/uploads/${c.files.billDoc}`} fileName="Utility Bill">Bill</FileViewer>
                    <FileViewer fileUrl={`http://localhost:5000/api/uploads/${c.files.campaignDoc}`} fileName="Campaign Doc">Doc</FileViewer>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
