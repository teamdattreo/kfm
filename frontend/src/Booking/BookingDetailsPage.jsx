import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const BookingDetailsPage = () => {
  const { eventType } = useParams();  // Get eventType from URL params
  const [bookings, setBookings] = useState([]);  // Store all bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Fetch all bookings for the selected event type
  useEffect(() => {

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    setAuthChecked(true);
    const fetchBookings = async () => {
      setLoading(true);  // Set loading state while data is being fetched
      try {
        let response;

        // Fetch bookings based on event type
        switch (eventType) {
          case 'wedding':
            response = await axios.get('http://localhost:4000/weddingBooking', {
              headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            break;
          case 'birthday':
            response = await axios.get('http://localhost:4000/birthdayBooking', {
              headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            break;
          case 'puberty':
            response = await axios.get('http://localhost:4000/pubertyBooking', {
              headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            break;
          default:
            throw new Error('Invalid event type');
        }

        setBookings(response.data);  // Set all bookings data
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);  // Set loading to false after data is fetched
      }
    };

    fetchBookings();
  }, [eventType]);

  // Handle delete booking
  const handleDelete = async (bookingId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this booking?');
    if (!confirmDelete) return;

    try {
      let response;

      // Based on event type, choose the correct API endpoint for delete
      switch (eventType) {
        case 'wedding':
          response = await axios.delete(`http://localhost:4000/weddingBooking/${bookingId}`, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
          });
          break;
        case 'birthday':
          response = await axios.delete(`http://localhost:4000/birthdayBooking/${bookingId}`, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
          });
          break;
        case 'puberty':
          response = await axios.delete(`http://localhost:4000/pubertyBooking/${bookingId}`, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
          });
          break;
        default:
          throw new Error('Invalid event type');
      }

      // Filter out the deleted booking from the state
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      alert('Booking deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  // Navigate to the booking update page
  const handleUpdate = (bookingId) => {
    navigate(`/updateBooking/${eventType}/${bookingId}`);  // Redirect to update page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          <h1>Bookings for {eventType}</h1>
        </div>

        {/* Error message */}
        {error && (
          <div>
            {error}
          </div>
        )}

        {/* Display Bookings */}
        {bookings.length === 0 ? (
          <p>No bookings found!</p>
        ) : (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Child's Name</th>
                  <th>Parent's Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Event Date</th>
                  <th>Location</th>
                  <th>Theme</th>
                  <th>Package</th>
                  <th>Actions</th> 
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    {/* Display fields depending on eventType */}
                    {eventType === 'wedding' && (
                      <>
                        <td>{booking.customerName}</td>
                        <td>{booking.brideName}</td>
                        <td>{booking.groomName}</td>
                        <td>{booking.brideFather}</td>
                        <td>{booking.brideMother}</td>
                        <td>{booking.groomFather}</td>
                        <td>{booking.groomMother}</td>
                      </>
                    )}
                    {eventType === 'birthday' && (
                      <>
                        <td>{booking.childName}</td>
                        <td>{booking.parentName}</td>
                        <td>{booking.age}</td>
                        <td>{booking.phone}</td>
                        <td>{booking.email}</td>
                      </>
                    )}
                    {eventType === 'puberty' && (
                      <>
                        <td>{booking.girlName}</td>
                        <td>{booking.parentName}</td>
                      </>
                    )}

                    <td>{booking.eventDate}</td>
                    <td>{booking.location}</td>
                    <td>{booking.theme}</td>
                    <td>{booking.package}</td> {/* Show package data */}

                    <td>
                      <button onClick={() => handleUpdate(booking._id)}>Update</button>
                      <button onClick={() => handleDelete(booking._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsPage;
