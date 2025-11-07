import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const AdminBookingPage = () => {
  const [selectedType, setSelectedType] = useState('');
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBookingData = async (type) => {
    setLoading(true);
    setError('');
    try {
      let response;
      switch (type) {
        case 'birthday':
          response = await axios.get('http://localhost:4000/birthdayBooking');
          break;
        case 'puberty':
          response = await axios.get('http://localhost:4000/pubertyBooking');
          break;
        case 'wedding':
          response = await axios.get('http://localhost:4000/weddingBooking');
          break;
        default:
          response = { data: [] };
      }
      // Sort bookings by creation date (newest first)
      const sortedData = response.data.sort((a, b) => 
        new Date(b.createdAt || b.bookingDate || b.eventDate) - 
        new Date(a.createdAt || a.bookingDate || a.eventDate)
      );
      setBookingsData(sortedData);
      setLoading(false);
    } catch (err) {
      setError('Error fetching data');
      setLoading(false);
    }
  };

  const handleCardClick = (type) => {
    setSelectedType(type);
    fetchBookingData(type);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      let endpoint;
      switch (selectedType) {
        case 'birthday':
          endpoint = 'birthdayBooking';
          break;
        case 'puberty':
          endpoint = 'pubertyBooking';
          break;
        case 'wedding':
          endpoint = 'weddingBooking';
          break;
        default:
          return;
      }

      await axios.put(`http://localhost:4000/${endpoint}/${bookingId}`, { status: newStatus });
      // Update local state
      setBookingsData(bookingsData.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-500';
      case 'denied':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* <Header /> */}
      </div>
      <div className="min-h-screen bg-black text-white flex flex-col items-center pt-32 pb-12 px-4 sm:px-6">
        <div className="text-center mb-10 max-w-2xl">
          <h1 className="bg-gradient-to-r from-white to-[#BF3030] bg-clip-text text-transparent text-4xl sm:text-5xl font-bold mb-3">
            Admin Booking Overview
          </h1>
          <p className="text-xs font-medium bg-gradient-to-r from-white to-[#BF3030] bg-clip-text text-transparent">
            Studio KFM | Professional Photography Services
          </p>
        </div>

        {/* Card Selection */}
        <div className="mb-8 flex gap-8 justify-center">
          <div
            onClick={() => handleCardClick('birthday')}
            className="cursor-pointer bg-gradient-to-r from-[#FFCF40] to-[#FF7F00] hover:scale-105 transition-transform duration-200 p-8 rounded-xl shadow-lg text-center text-black"
          >
            <h2 className="text-2xl font-bold mb-4">Birthday Booking</h2>
            <p>Select this card to view birthday booking details</p>
          </div>

          <div
            onClick={() => handleCardClick('puberty')}
            className="cursor-pointer bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] hover:scale-105 transition-transform duration-200 p-8 rounded-xl shadow-lg text-center text-black"
          >
            <h2 className="text-2xl font-bold mb-4">Puberty Booking</h2>
            <p>Select this card to view puberty booking details</p>
          </div>

          <div
            onClick={() => handleCardClick('wedding')}
            className="cursor-pointer bg-gradient-to-r from-[#FF6A00] to-[#FF4500] hover:scale-105 transition-transform duration-200 p-8 rounded-xl shadow-lg text-center text-black"
          >
            <h2 className="text-2xl font-bold mb-4">Wedding Booking</h2>
            <p>Select this card to view wedding booking details</p>
          </div>
        </div>

        {loading ? (
          <p className="text-white">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : selectedType && bookingsData.length > 0 ? (
          <>
            <div className="w-full max-w-6xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] opacity-90 border border-gray-700 p-8 rounded-xl shadow-2xl mb-8 overflow-x-auto">
              <h2 className="text-3xl font-bold mb-8 text-white text-center">
                {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Bookings
              </h2>
              <table className="w-full table-auto text-white">
                <thead>
                  <tr>
                    {selectedType === 'birthday' && (
                      <>
                        <th className="px-4 py-2">Child's Name</th>
                        <th className="px-4 py-2">Parent's Name</th>
                        <th className="px-4 py-2">Phone</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Event Date</th>
                        <th className="px-4 py-2">Location</th>
                        <th className="px-4 py-2">Theme</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                        <th className="px-4 py-2">Notes</th>
                      </>
                    )}
                    {selectedType === 'puberty' && (
                      <>
                        <th className="px-4 py-2">Girl's Name</th>
                        <th className="px-4 py-2">Phone</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Event Date</th>
                        <th className="px-4 py-2">Booking Date</th>
                        <th className="px-4 py-2">Location</th>
                        <th className="px-4 py-2">Outfit Change</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                        <th className="px-4 py-2">Notes</th>
                      </>
                    )}
                    {selectedType === 'wedding' && (
                      <>
                        <th className="px-4 py-2">Customer Name</th>
                        <th className="px-4 py-2">Bride Name</th>
                        <th className="px-4 py-2">Groom Name</th>
                        <th className="px-4 py-2">Phone</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Event Date</th>
                        <th className="px-4 py-2">Reception Date</th>
                        <th className="px-4 py-2">Location</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                        <th className="px-4 py-2">Notes</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {bookingsData.map((booking, index) => (
                    <tr key={index} className="hover:bg-gray-800">
                      {selectedType === 'birthday' && (
                        <>
                          <td className="px-4 py-2">{booking.childName}</td>
                          <td className="px-4 py-2">{booking.parentName}</td>
                          <td className="px-4 py-2">{booking.phone}</td>
                          <td className="px-4 py-2">{booking.email}</td>
                          <td className="px-4 py-2">{new Date(booking.eventDate).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{booking.location}</td>
                          <td className="px-4 py-2">{booking.theme}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                              {booking.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={booking.status || 'pending'}
                              onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                              className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="denied">Denied</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">{booking.notes}</td>
                        </>
                      )}
                      {selectedType === 'puberty' && (
                        <>
                          <td className="px-4 py-2">{booking.girlName}</td>
                          <td className="px-4 py-2">{booking.phone}</td>
                          <td className="px-4 py-2">{booking.email}</td>
                          <td className="px-4 py-2">{new Date(booking.eventDate).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{booking.location}</td>
                          <td className="px-4 py-2">{booking.outfitChange}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                              {booking.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={booking.status || 'pending'}
                              onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                              className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="denied">Denied</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">{booking.notes}</td>
                        </>
                      )}
                      {selectedType === 'wedding' && (
                        <>
                          <td className="px-4 py-2">{booking.customerName}</td>
                          <td className="px-4 py-2">{booking.brideName}</td>
                          <td className="px-4 py-2">{booking.groomName}</td>
                          <td className="px-4 py-2">{booking.phone}</td>
                          <td className="px-4 py-2">{booking.email}</td>
                          <td className="px-4 py-2">{new Date(booking.eventDate).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{new Date(booking.receptionDate).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{booking.location}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                              {booking.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={booking.status || 'pending'}
                              onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                              className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="denied">Denied</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">{booking.notes}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-white">No bookings available for the selected type.</p>
        )}
      </div>
    </div>
  );
};

export default AdminBookingPage;