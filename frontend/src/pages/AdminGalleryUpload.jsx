// import React, { useState } from "react";
// import axios from "axios";

// const AdminGalleryUpload = () => {
//   const [image, setImage] = useState(null);
//   const [category, setCategory] = useState("");
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     if (file) setPreviewUrl(URL.createObjectURL(file));
//     else setPreviewUrl(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!image || !category) {
//       alert("Both image and category are required.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", image);

//     // Capitalize category to match schema
//     const formattedCategory =
//       category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
//     formData.append("category", formattedCategory);

//     try {
//       setLoading(true);
//       console.log("📤 Uploading:", { image, formattedCategory });
//       await axios.post("http://localhost:4000/gallery/upload", formData);
//       alert("Image uploaded successfully!");
//       setImage(null);
//       setCategory("");
//       setPreviewUrl(null);
//     } catch (err) {
//       console.error("🔥 Upload failed:", err.response?.data || err.message);
//       alert("Upload failed: " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white max-w-md mx-auto p-6 rounded-md shadow-md mt-10 font-sans">
//       <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
//         Upload Image to <span className="text-yellow-500">Gallery</span>
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* File Input */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">Select Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
//           />
//         </div>

//         {/* Preview */}
//         {previewUrl && (
//           <img
//             src={previewUrl}
//             alt="Preview"
//             className="w-full h-48 object-cover rounded-md"
//           />
//         )}

//         {/* Category */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">Category</label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="block w-full border border-gray-300 rounded-md p-2 text-sm"
//           >
//             <option value="">-- Select --</option>
//             <option value="wedding">Wedding</option>
//             <option value="birthday">Birthday</option>
//             <option value="portrait">Portrait</option>
//             <option value="shots">Shots</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
//         >
//           {loading ? "Uploading..." : "Upload"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AdminGalleryUpload;
import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminGalleryUpload = () => {
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


    //////////////////////////////////////////////////
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
      } else {
        setIsAuthenticated(true);
        setLoadingAuth(false);
      }
    }, [navigate]);
  
    if (loadingAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-white">Loading...</div>
        </div>
      );
    }
  
    // If not authenticated (but still rendering somehow), show nothing
    if (!isAuthenticated) {
      return null;
    }
  
    //////////////////////////////////////////

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !category) {
      setMessage("Both image and category are required");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    // Capitalize category to match schema
    const formattedCategory =
      category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    formData.append("category", formattedCategory);

    try {
      setLoading(true);
      setMessage("");
      console.log("📤 Uploading:", { image, formattedCategory });
      await axios.post("http://localhost:4000/gallery/upload", formData);
      setMessage("Image uploaded successfully!");
      setImage(null);
      setCategory("");
      setPreviewUrl(null);
    } catch (err) {
      console.error("🔥 Upload failed:", err.response?.data || err.message);
      setMessage("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const colorTheme = {
    card: 'bg-gray-800',
    accent: 'bg-amber-600 hover:bg-amber-700',
    muted: 'text-gray-400',
  };

  return (
    <div className={`${colorTheme.card} max-w-md mx-auto p-6 rounded-xl shadow-lg mt-10`}>
      <h2 className="text-2xl font-semibold mb-6 text-center text-amber-400">
        Upload Image to <span className="text-white">Gallery</span>
      </h2>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.includes('success') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block font-medium text-gray-300 mb-1">Select Image</label>
          <div className={`border border-gray-700 rounded-md p-1 ${colorTheme.card}`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
            />
          </div>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="border border-gray-700 rounded-md overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block font-medium text-gray-300 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`block w-full border border-gray-700 rounded-md p-2 text-sm ${colorTheme.card} text-gray-300`}
          >
            <option value="">-- Select --</option>
            <option value="wedding">Wedding</option>
            <option value="birthday">Birthday</option>
            <option value="portrait">Portrait</option>
            <option value="shots">Shots</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${colorTheme.accent} text-white py-2 rounded-md font-medium`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default AdminGalleryUpload;