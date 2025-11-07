import React, { useState } from 'react';

const Banners = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const colorTheme = {
    bg: 'bg-[#1a1a1a]',
    card: 'bg-gray-800 border border-gray-700',
    accent: 'bg-amber-500 hover:bg-amber-600 text-white',
    text: 'text-white',
    muted: 'text-gray-400',
    border: 'border-amber-400',
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
  
      const response = await fetch('http://localhost:4000/BannersOperations/upload', {
        method: 'POST',
        body: formData
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Backend error response:', data);
        throw new Error(data.error || `Upload failed (Status: ${response.status})`);
      }
  
      setMessage('Banner updated successfully!');
      console.log('Uploaded URL:', data.url);
  
    } catch (error) {
      console.error('Full error:', error);
      setMessage(`Upload failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${colorTheme.card} rounded-xl p-8 max-w-xl mx-auto shadow-lg`}>
      <h2 className={`text-2xl font-bold mb-6 text-amber-400 flex items-center gap-2`}>
        Home page Banner
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
          className={`${colorTheme.accent} px-6 py-2 rounded-full font-semibold shadow-md w-full disabled:opacity-50`}
        >
          {isLoading ? 'Uploading...' : 'Upload Banner'}
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

export default Banners;