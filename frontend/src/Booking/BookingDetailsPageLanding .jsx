import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, api } from '../api';
import Header from '../components/Header';

const AdminBookingPage = () => {
  const [selectedType, setSelectedType] = useState('');
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [expenseFormData, setExpenseFormData] = useState({
    customerName: '',
    mobileNumber: '',
    eventDate: '',
    eventType: '',
    totalAmount: '',
    paymentAmount: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });

  const fetchBookingData = async (type) => {
    setLoading(true);
    setError('');
    try {
      let response;
      switch (type) {
        case 'birthday':
          response = await api.get(API_ENDPOINTS.BOOKINGS.BIRTHDAY);
          break;
        case 'puberty':
          response = await api.get(API_ENDPOINTS.BOOKINGS.PUBERTY);
          break;
        case 'wedding':
          response = await api.get(API_ENDPOINTS.BOOKINGS.WEDDING);
          break;
        default:
          response = { data: [] };
      }
      // Sort bookings by creation date (newest first)
      const list = Array.isArray(response) ? response : [];
      const sortedData = list.sort((a, b) => 
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

      const endpointMap = {
        'weddingBooking': API_ENDPOINTS.BOOKINGS.UPDATE_WEDDING(bookingId),
        'birthdayBooking': API_ENDPOINTS.BOOKINGS.UPDATE_BIRTHDAY(bookingId),
        'pubertyBooking': API_ENDPOINTS.BOOKINGS.UPDATE_PUBERTY(bookingId)
      };
      await api.put(endpointMap[endpoint], { status: newStatus });
      // Update local state
      setBookingsData(bookingsData.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const handleAddPayment = (booking) => {
    setSelectedBookingForPayment(booking);
    
    // Extract data based on booking type
    let customerName = '';
    let mobileNumber = '';
    let eventDate = '';
    
    switch (selectedType) {
      case 'birthday':
        customerName = booking.parentName || booking.childName || '';
        mobileNumber = booking.phone || '';
        eventDate = booking.eventDate || '';
        break;
      case 'puberty':
        customerName = booking.girlName || '';
        mobileNumber = booking.phone || '';
        eventDate = booking.eventDate || '';
        break;
      case 'wedding':
        customerName = booking.customerName || booking.brideName || booking.groomName || '';
        mobileNumber = booking.phone || '';
        eventDate = booking.eventDate || booking.receptionDate || '';
        break;
      default:
        customerName = '';
    }

    // Set the expense form data
    setExpenseFormData({
      customerName: customerName,
      mobileNumber: mobileNumber,
      eventDate: eventDate ? new Date(eventDate).toISOString().split('T')[0] : '',
      eventType: selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
      totalAmount: '',
      paymentAmount: '',
      paymentDate: new Date().toISOString().split('T')[0]
    });

    setShowExpenseForm(true);
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

  const closeExpenseForm = () => {
    setShowExpenseForm(false);
    setSelectedBookingForPayment(null);
  };

  const handleExpenseSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form data
  if (!expenseFormData.totalAmount || !expenseFormData.paymentAmount) {
    setError('Please fill in all required fields');
    return;
  }

  try {
    // Convert string values to numbers
    const payload = {
      ...expenseFormData,
      totalAmount: Number(expenseFormData.totalAmount),
      paymentAmount: Number(expenseFormData.paymentAmount)
    };

    console.log("Submitting payment:", payload); // Debug log
    
    const response = await api.post(API_ENDPOINTS.EXPENSES.CREATE, payload);
    
    console.log("Payment response:", response); // Debug log
    
    if (response.success || response.message) {
      alert(response.message || 'Payment added successfully!');
      closeExpenseForm();
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (err) {
    console.error('Error adding payment:', err);
    
    // Show more detailed error
    if (err.response?.data?.message) {
      setError(`Failed to add payment: ${err.response.data.message}`);
    } else if (err.message) {
      setError(`Failed to add payment: ${err.message}`);
    } else {
      setError('Failed to add payment. Please try again.');
    }
    
    // Keep the form open to show error
  }
};

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenseFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative">
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-amber-400">
                  Add Payment for Booking
                </h2>
                <button
                  onClick={closeExpenseForm}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              {selectedBookingForPayment && (
                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Booking Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-400">Customer:</span>
                    <span className="text-white">{expenseFormData.customerName}</span>
                    
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white">{expenseFormData.mobileNumber}</span>
                    
                    <span className="text-gray-400">Event Type:</span>
                    <span className="text-white">{expenseFormData.eventType}</span>
                    
                    <span className="text-gray-400">Event Date:</span>
                    <span className="text-white">{expenseFormData.eventDate}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={expenseFormData.customerName}
                      onChange={handleExpenseChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={expenseFormData.mobileNumber}
                      onChange={handleExpenseChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Event Date
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={expenseFormData.eventDate}
                      onChange={handleExpenseChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Event Type
                    </label>
                    <select
                      name="eventType"
                      value={expenseFormData.eventType}
                      onChange={handleExpenseChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white"
                      required
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Puberty">Puberty</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Photoshoot">Photoshoot</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Total Amount (LKR)
                    </label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={expenseFormData.totalAmount}
                      onChange={handleExpenseChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Payment Amount (LKR)
                    </label>
                    <input
                      type="number"
                      name="paymentAmount"
                      value={expenseFormData.paymentAmount}
                      onChange={handleExpenseChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={expenseFormData.paymentDate}
                      onChange={handleExpenseChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeExpenseForm}
                    className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md"
                  >
                    Add Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 z-40">
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
                        <th className="px-4 py-2">Payment</th>
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
                        <th className="px-4 py-2">Payment</th>
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
                        <th className="px-4 py-2">Payment</th>
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
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleAddPayment(booking)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                            >
                              Add Payment
                            </button>
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
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleAddPayment(booking)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                            >
                              Add Payment
                            </button>
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
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleAddPayment(booking)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                            >
                              Add Payment
                            </button>
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