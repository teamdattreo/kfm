import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateBookingPage = () => {
  const { eventType, bookingId } = useParams();  // Get eventType and bookingId from URL params
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Fetch booking details to be updated
  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);  // Set loading state while data is being fetched
      try {
        let response;
        switch (eventType) {
          case 'wedding':
            response = await axios.get(`http://localhost:4000/weddingBooking/${bookingId}`, {
              headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            break;
          case 'birthday':
            response = await axios.get(`http://localhost:4000/birthdayBooking/${bookingId}`, {
              headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            break;
          case 'puberty':
            response = await axios.get(`http://localhost:4000/pubertyBooking/${bookingId}`, {
              headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            break;
          default:
            throw new Error('Invalid event type');
        }
        setBooking(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [eventType, bookingId]);

  // Handle update booking submission
  const handleUpdate = async () => {
    setIsSubmitting(true);

    try {
      let response;
      switch (eventType) {
        case 'wedding':
          response = await axios.put(`http://localhost:4000/weddingBooking/${bookingId}`, booking, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
          });
          break;
        case 'birthday':
          response = await axios.put(`http://localhost:4000/birthdayBooking/${bookingId}`, booking, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
          });
          break;
        case 'puberty':
          response = await axios.put(`http://localhost:4000/pubertyBooking/${bookingId}`, booking, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
          });
          break;
        default:
          throw new Error('Invalid event type');
      }

      alert('Booking updated successfully!');
      setIsSubmitting(false);
      navigate(`/BookingDetailsPage/${eventType}`); // Redirect back to the bookings list
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.message || 'Failed to update booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-amber-900/10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-900/20 via-black/70 to-amber-900/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-amber-300 capitalize">Update Booking</h1>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100">
              {error}
            </div>
          )}

          {/* Update Form */}
          {booking && (
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={booking.name}
                  onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="tel"
                  value={booking.phone}
                  onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={booking.email}
                  onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                />
              </div>
              <div>
                <label>Event Date</label>
                <input
                  type="date"
                  value={booking.eventDate}
                  onChange={(e) => setBooking({ ...booking, eventDate: e.target.value })}
                />
              </div>
              <div>
                <label>Location</label>
                <input
                  type="text"
                  value={booking.location}
                  onChange={(e) => setBooking({ ...booking, location: e.target.value })}
                />
              </div>
              <div>
                <label>Notes</label>
                <textarea
                  value={booking.notes}
                  onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                />
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-xl font-bold ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#FFCF40] text-white hover:bg-[#e6b935] shadow-lg'} transition-all duration-200`}
                >
                  {isSubmitting ? 'Updating...' : 'Update Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateBookingPage;
