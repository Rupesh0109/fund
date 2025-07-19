import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const FileViewer = ({ fileUrl, fileName, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);

  const openModal = async (e) => {
    e.preventDefault();
    setIsOpen(true);
    try {
      const response = await api.get(fileUrl, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      setBlobUrl(url);
    } catch (error) {
      console.error('Failed to load file:', error);
      setBlobUrl(null);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
  };

  return (
    <>
      <a href="#" onClick={openModal} className="text-blue-600 underline">
        {children || fileName}
      </a>

      {isOpen && blobUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg max-w-4xl w-full max-h-full p-4 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 font-bold text-xl"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="overflow-auto" style={{ height: '80vh' }}>
              <iframe
                src={blobUrl}
                title={fileName}
                className="w-full h-full"
                frameBorder="0"
              />
            </div>
            <div className="mt-2 text-right">
              <a
                href={blobUrl}
                download={fileName}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}

      {isOpen && !blobUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg max-w-md w-full p-4 relative text-center">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 font-bold text-xl"
              aria-label="Close"
            >
              &times;
            </button>
            <p className="text-red-600">Failed to load file.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default FileViewer;
