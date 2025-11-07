import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminGalleryUpload from "./AdminGalleryUpload";

const AdminGalleryTable = () => {
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCategory, setEditedCategory] = useState("");
  const [message, setMessage] = useState("");

  const fetchGallery = async () => {
    try {
      const res = await axios.get("http://localhost:4000/gallery");
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching gallery:", err);
      setMessage("Failed to load gallery images");
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await axios.delete(`http://localhost:4000/gallery/${id}`);
      setMessage("Image deleted successfully");
      fetchGallery();
    } catch (err) {
      console.error("Delete failed:", err);
      setMessage("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const startEdit = (id, category) => {
    setEditingId(id);
    setEditedCategory(category);
    setMessage("");
  };

  const handleUpdate = async (id) => {
    try {
      const formattedCategory =
        editedCategory.charAt(0).toUpperCase() + editedCategory.slice(1).toLowerCase();
      await axios.put(`http://localhost:4000/gallery/${id}`, {
        category: formattedCategory,
      });
      setMessage("Category updated successfully");
      setEditingId(null);
      setEditedCategory("");
      fetchGallery();
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  const colorTheme = {
    card: 'bg-gray-800',
    accent: 'bg-amber-600 hover:bg-amber-700',
    muted: 'text-gray-400',
  };

  return (
    <div className={`${colorTheme.card} rounded-xl p-6 max-w-5xl mx-auto shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-amber-400">
          Gallery <span className="text-white">Management</span>
        </h2>
        <AdminGalleryUpload onUploadSuccess={fetchGallery} />
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.includes('success') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-300 uppercase">Image</th>
              <th className="p-3 text-left text-sm font-medium text-gray-300 uppercase">Category</th>
              <th className="p-3 text-left text-sm font-medium text-gray-300 uppercase">Uploaded At</th>
              <th className="p-3 text-left text-sm font-medium text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {images.map((img) => (
              <tr key={img._id} className="hover:bg-gray-700">
                <td className="p-3">
                  <img
                    src={img.imageUrl}
                    alt="Gallery item"
                    className="w-20 h-14 object-cover rounded"
                  />
                </td>
                <td className="p-3 text-gray-300">
                  {editingId === img._id ? (
                    <select
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value)}
                      className={`${colorTheme.card} border border-gray-600 rounded-md p-1 text-gray-300`}
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Portrait">Portrait</option>
                      <option value="Shots">Shots</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      img.category === 'Wedding' ? 'bg-purple-900 text-purple-300' :
                      img.category === 'Birthday' ? 'bg-blue-900 text-blue-300' :
                      img.category === 'Portrait' ? 'bg-green-900 text-green-300' :
                      'bg-yellow-900 text-yellow-300'
                    }`}>
                      {img.category}
                    </span>
                  )}
                </td>
                <td className="p-3 text-gray-400">
                  {new Date(img.uploadedAt).toLocaleString()}
                </td>
                <td className="p-3 space-x-2">
                  {editingId === img._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(img._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(img._id, img.category)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(img._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {images.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-gray-400 text-center">
                  No images found in gallery
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGalleryTable;
