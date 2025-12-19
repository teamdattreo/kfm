import React, { useEffect, useState } from "react";
import { API_ENDPOINTS, api } from '../api';
import Masonry from "react-masonry-css";
import { useNavigate } from "react-router-dom";

const GalleryPage = () => {
  // Authentication state and navigation
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Gallery state
  const [images, setImages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  // Check authentication first
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
      setLoadingAuth(false);
    }
  }, [navigate]);

  // Fetch images only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchImages = async () => {
        try {
          const res = await api.get(API_ENDPOINTS.GALLERY.GET_ALL);
          setImages(res.data);
          setFiltered(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchImages();
    }
  }, [isAuthenticated]);

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFiltered(images);
    } else {
      setFiltered(
        images.filter(
          (img) =>
            img.category &&
            img.category.toLowerCase() === category.toLowerCase()
        )
      );
    }
  };

  const categories = ["All", "Portrait", "Wedding", "Birthday", "Shots"];

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="relative bg-black min-h-screen px-4 py-10 text-white font-sans overflow-hidden">
      {/* <div
        className="absolute opacity-20 rounded-full"
        style={{
          backgroundColor: "#FFCF40",
          width: "120px",
          height: "120px",
          top: "-40px",
          left: "0px",
          zIndex: 0,
        }}
      ></div>
  
      <div
        className="absolute opacity-20 rounded-full blur-2xl"
        style={{
          backgroundColor: "#FFCF40",
          width: "300px",
          height: "300px",
          top: "-40px",
          left: "-80px",
          zIndex: 0,
        }}
      ></div>
  
      <div
        className="absolute opacity-20 rounded-full"
        style={{
          backgroundColor: "#BF3030",
          width: "160px",
          height: "160px",
          bottom: "-50px",
          right: "-90px",
          zIndex: 0,
        }}
      ></div>
  
      <div
        className="absolute opacity-20 rounded-full blur-2xl"
        style={{
          backgroundColor: "#BF3030",
          width: "260px",
          height: "260px",
          bottom: "-130px",
          right: "-10px",
          zIndex: 0,
        }}
      ></div> */}
  
      <div className="relative z-10">
        <h2 className="text-center text-3xl font-semibold mb-8">
          Our <span className="text-amber-500">Gallery</span> View
        </h2>
  
        {/* Category filter buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-amber-500 text-gray-900 font-bold"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
  
        {/* Gallery content */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 text-lg mt-10">
            No images found for "{activeCategory}"
          </p>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-full gap-4"
            columnClassName="my-masonry-grid_column"
          >
            {filtered.map((img) =>
              img?.imageUrl ? (
                <div
                  key={img._id}
                  className="mb-4 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.category}
                    loading="lazy"
                    className="w-full h-auto object-cover rounded-lg hover:scale-105 transition duration-300 ease-in-out"
                  />
                </div>
              ) : null
            )}
          </Masonry>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
