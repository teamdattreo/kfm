import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, api } from '../api';
import Header from '../components/Header';

const UserBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          navigate('/login');
          return;
        }

        // Fetch all booking types in parallel
        const [weddings, birthdays, puberties] = await Promise.all([
          api.get(API_ENDPOINTS.BOOKINGS.USER_WEDDING(userId)),
          api.get(API_ENDPOINTS.BOOKINGS.USER_BIRTHDAY(userId)),
          api.get(API_ENDPOINTS.BOOKINGS.USER_PUBERTY(userId))
        ]);

        // Combine all bookings with their types
        const weddingsList = Array.isArray(weddings) ? weddings : [];
        const birthdaysList = Array.isArray(birthdays) ? birthdays : [];
        const pubertiesList = Array.isArray(puberties) ? puberties : [];
        const allBookings = [
          ...weddingsList.map(b => ({ ...b, type: 'Wedding' })),
          ...birthdaysList.map(b => ({ ...b, type: 'Birthday' })),
          ...pubertiesList.map(b => ({ ...b, type: 'Puberty' }))
        ].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

        setBookings(allBookings);
        
      } catch (err) {
        console.error('Error fetching bookings:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        if (err.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          navigate('/login');
        } else {
          setError(err.data?.message || err.message || 'Failed to load bookings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [navigate]);

  const handleDelete = async (bookingId, bookingType) => {
    try {
      let endpoint;
      switch(bookingType) {
        case 'Wedding':
          endpoint = 'weddingBooking';
          break;
        case 'Birthday':
          endpoint = 'birthdayBooking';
          break;
        case 'Puberty':
          endpoint = 'pubertyBooking';
          break;
        default:
          throw new Error('Invalid booking type');
      }

      const endpointMap = {
        'weddingBooking': API_ENDPOINTS.BOOKINGS.DELETE_WEDDING(bookingId),
        'birthdayBooking': API_ENDPOINTS.BOOKINGS.DELETE_BIRTHDAY(bookingId),
        'pubertyBooking': API_ENDPOINTS.BOOKINGS.DELETE_PUBERTY(bookingId)
      };
      await api.delete(endpointMap[endpoint]);
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      alert('Booking deleted successfully');
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete booking');
    }
  };

  const getBookingTitle = (booking) => {
    switch(booking.type) {
      case 'Wedding':
        return `${booking.brideName} & ${booking.groomName}`;
      case 'Birthday':
        return `${booking.childName}'s ${booking.age}th Birthday`;
      case 'Puberty':
        return `${booking.girlName}'s Puberty Ceremony`;
      default:
        return 'Event Booking';
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

  const getBookingDetails = (booking) => {
    const details = [
      { label: 'Type', value: booking.type },
      { label: 'Date', value: new Date(booking.eventDate).toLocaleDateString() },
      { label: 'Package', value: booking.package },
      { 
        label: 'Status', 
        value: (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
            {booking.status || 'Pending'}
          </span>
        ) 
      }
    ];

    if (booking.location) details.push({ label: 'Location', value: booking.location });
    if (booking.phone) details.push({ label: 'Phone', value: booking.phone });

    return details;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading your bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      
      <div className="pt-32 pb-12 px-4 sm:px-6">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="bg-gradient-to-r from-white to-[#BF3030] bg-clip-text text-transparent text-4xl sm:text-5xl font-bold mb-3">
            Your Bookings History
          </h1>
          <p className="text-xs font-medium bg-gradient-to-r from-white to-[#BF3030] bg-clip-text text-transparent">
            Studio KFM | Manage All Your Bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl mb-4">You haven't made any bookings yet.</p>
            <button 
              onClick={() => navigate('/book')}
              className="px-6 py-2 bg-[#FFCF40] rounded-lg font-medium text-black hover:bg-[#e6b935] transition"
            >
              Create New Booking
            </button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <div 
                  key={`${booking.type}-${booking._id}`} 
                  className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] border border-gray-700 rounded-xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-2 text-[#FFCF40]">
                    {getBookingTitle(booking)}
                  </h3>
                  <div className="space-y-2">
                    {getBookingDetails(booking).map((detail, index) => (
                      <p key={index} className="flex items-center">
                        <span className="font-semibold mr-2">{detail.label}:</span> 
                        {detail.value}
                      </p>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => handleDelete(booking._id, booking.type)}
                      className="px-4 py-2 bg-red-600 rounded-lg text-sm"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookingsPage;
