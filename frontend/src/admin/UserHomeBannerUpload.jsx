// BannerUpload.jsx
import React, { useState } from 'react';

const UserHomeBannerUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const colorTheme = {
    card: 'bg-gray-800 border border-gray-700',
    accent: 'bg-amber-500 hover:bg-amber-600 text-white',
    text: 'text-white',
    muted: 'text-gray-400',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:4000/BannersUI/upload1', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setMessage('Banner updated successfully!');
      setFile(null); // Reset file input after successful upload
    } catch (error) {
      setMessage(`Upload failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${colorTheme.card} rounded-xl p-8 max-w-xl mx-auto shadow-lg`}>
      <h2 className={`text-2xl font-bold mb-6 text-amber-400 flex items-center gap-2`}>
        Register User Home Page Banner
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
            accept="image/*"
            className={`block w-full text-sm ${colorTheme.muted}
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              ${colorTheme.accent.replace('bg-', 'file:bg-').replace('hover:bg-', 'file:hover:bg-')}
              file:cursor-pointer
              disabled:opacity-50`}
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={`${colorTheme.accent} px-6 py-2 rounded-full font-semibold shadow-md w-full disabled:opacity-50 transition-colors`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : 'Upload Banner'}
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('success') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default UserHomeBannerUpload;