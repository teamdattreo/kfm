import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, api } from '../api';
import Header from '../components/Header';

const UserBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBooking, setExpandedBooking] = useState(null);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          navigate('/login');
          return;
        }

        // Fetch all booking types, packages, and payments in parallel
        const [weddingsResponse, birthdaysResponse, pubertiesResponse, packagesResponse, paymentsResponse] = await Promise.all([
          api.get(API_ENDPOINTS.BOOKINGS.USER_WEDDING(userId)),
          api.get(API_ENDPOINTS.BOOKINGS.USER_BIRTHDAY(userId)),
          api.get(API_ENDPOINTS.BOOKINGS.USER_PUBERTY(userId)),
          api.get(API_ENDPOINTS.PACKAGES.GET_ALL),
          api.get(API_ENDPOINTS.EXPENSES.ALL) // Fetch all payments
        ]);

        // Process packages
        const packagesData = Array.isArray(packagesResponse) ? packagesResponse : 
                           packagesResponse?.data ? packagesResponse.data : [];
        setPackages(packagesData);

        // Process payments
        let paymentsData = [];
        if (Array.isArray(paymentsResponse)) {
          paymentsData = paymentsResponse;
        } else if (paymentsResponse?.data && Array.isArray(paymentsResponse.data)) {
          paymentsData = paymentsResponse.data;
        } else if (paymentsResponse?.expenses && Array.isArray(paymentsResponse.expenses)) {
          paymentsData = paymentsResponse.expenses;
        }
        console.log('Payments data:', paymentsData);
        setPayments(paymentsData);

        // Process bookings
        const weddings = Array.isArray(weddingsResponse) ? weddingsResponse : 
                        weddingsResponse?.data ? weddingsResponse.data : [];
        const birthdays = Array.isArray(birthdaysResponse) ? birthdaysResponse : 
                         birthdaysResponse?.data ? birthdaysResponse.data : [];
        const puberties = Array.isArray(pubertiesResponse) ? pubertiesResponse : 
                         pubertiesResponse?.data ? pubertiesResponse.data : [];

        const allBookings = [
          ...weddings.map(b => ({ ...b, type: 'Wedding' })),
          ...birthdays.map(b => ({ ...b, type: 'Birthday' })),
          ...puberties.map(b => ({ ...b, type: 'Puberty' }))
        ].sort((a, b) => new Date(b.createdAt || b.eventDate) - new Date(a.createdAt || a.eventDate));

        console.log('All bookings:', allBookings);
        setBookings(allBookings);
        
      } catch (err) {
        console.error('Error fetching bookings:', err);
        
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to load bookings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [navigate]);

  // Find matching payment for a booking
  const findMatchingPayment = (booking) => {
    if (!payments || payments.length === 0) return null;

    const customerName = getCustomerName(booking);
    const customerPhone = booking.phone || '';
    const eventDate = booking.eventDate ? new Date(booking.eventDate).toISOString().split('T')[0] : '';
    
    console.log(`Looking for payment for: ${customerName}, ${customerPhone}, ${eventDate}, ${booking.type}`);

    // Try multiple matching strategies
    return payments.find(payment => {
      // Strategy 1: Match by customer name and phone (exact match)
      if (payment.customerName?.toLowerCase() === customerName.toLowerCase() &&
          payment.mobileNumber === customerPhone) {
        return true;
      }
      
      // Strategy 2: Match by customer name and event type
      if (payment.customerName?.toLowerCase() === customerName.toLowerCase() &&
          payment.eventType === booking.type) {
        return true;
      }
      
      // Strategy 3: Match by event date and type
      const paymentEventDate = payment.eventDate ? new Date(payment.eventDate).toISOString().split('T')[0] : '';
      if (paymentEventDate === eventDate && payment.eventType === booking.type) {
        return true;
      }
      
      // Strategy 4: Match by phone number only
      if (payment.mobileNumber === customerPhone && customerPhone) {
        return true;
      }
      
      return false;
    }) || null;
  };

  // Helper function to get customer name from booking
  const getCustomerName = (booking) => {
    switch(booking.type) {
      case 'Wedding':
        return booking.customerName || booking.brideName || booking.groomName || '';
      case 'Birthday':
        return booking.parentName || booking.childName || '';
      case 'Puberty':
        return booking.girlName || '';
      default:
        return '';
    }
  };

  const getPackageName = (packageId) => {
  if (!packageId) return 'Standard Package';
  
  console.log('Looking for package:', packageId);
  console.log('Available packages:', packages);
  
  // Try different ways to find the package
  let pkg = null;
  
  // Check if packageId is an object with _id
  if (typeof packageId === 'object' && packageId._id) {
    pkg = packages.find(p => p._id === packageId._id);
    if (pkg) return pkg.name || pkg.type || 'Package';
    
    // Try direct properties
    return packageId.name || packageId.type || packageId._id || 'Package';
  }
  
  // If packageId is a string (ID)
  if (typeof packageId === 'string') {
    pkg = packages.find(p => p._id === packageId);
    if (pkg) return pkg.name || pkg.type || 'Package';
    
    // Check if it's a package name directly
    const directPackage = packages.find(p => 
      p.name?.toLowerCase() === packageId.toLowerCase() || 
      p.type?.toLowerCase() === packageId.toLowerCase()
    );
    if (directPackage) return directPackage.name || directPackage.type || 'Package';
  }
  
  // Return the ID itself if no match found
  return typeof packageId === 'object' ? 'Custom Package' : packageId || 'Standard Package';
};

  const handleDelete = async (bookingId, bookingType) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

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
      alert('Booking cancelled successfully');
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to cancel booking');
    }
  };

  const getBookingTitle = (booking) => {
    switch(booking.type) {
      case 'Wedding':
        return `${booking.brideName} & ${booking.groomName}'s Wedding`;
      case 'Birthday':
        return `${booking.childName}'s ${booking.age}th Birthday`;
      case 'Puberty':
        return `${booking.girlName}'s Puberty Ceremony`;
      default:
        return 'Event Booking';
    }
  };

  const getStatusColor = (status) => {
    switch((status || '').toLowerCase()) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'denied':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPaymentInfo = (booking) => {
    const payment = findMatchingPayment(booking);
    
    if (!payment) {
      return {
        hasPayment: false,
        totalAmount: 0,
        paidAmount: 0,
        balance: 0,
        status: 'No Payment Recorded',
        colorClass: 'bg-gray-500',
        paymentDate: null
      };
    }

    const totalAmount = payment.totalAmount || 0;
    const paidAmount = payment.paymentAmount || 0;
    const balance = totalAmount - paidAmount;

    let status = 'No Payment';
    let colorClass = 'bg-gray-500';

    if (balance === 0 && totalAmount > 0) {
      status = 'Paid in Full';
      colorClass = 'bg-green-500';
    } else if (paidAmount > 0 && balance > 0) {
      status = 'Partial Payment';
      colorClass = 'bg-yellow-500';
    } else if (paidAmount === 0 && totalAmount > 0) {
      status = 'Payment Pending';
      colorClass = 'bg-red-500';
    } else if (totalAmount === 0) {
      status = 'Free Event';
      colorClass = 'bg-blue-500';
    }

    return {
      hasPayment: true,
      totalAmount,
      paidAmount,
      balance,
      status,
      colorClass,
      paymentDate: payment.paymentDate,
      paymentId: payment._id
    };
  };

  const toggleBookingDetails = (bookingId) => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(bookingId);
    }
  };

  const formatCurrency = (amount) => {
    return `LKR ${amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <div className="max-w-6xl mx-auto space-y-6">
            {bookings.map((booking) => {
              const paymentInfo = getPaymentInfo(booking);
              const isExpanded = expandedBooking === booking._id;

              return (
                <div 
                  key={`${booking.type}-${booking._id}`} 
                  className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => toggleBookingDetails(booking._id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#FFCF40]">
                        {getBookingTitle(booking)}
                      </h3>
                      <p className="text-gray-300 mt-1">
                        {formatDate(booking.eventDate)} • {booking.type}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status || 'Pending'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentInfo.colorClass}`}>
                        {paymentInfo.status}
                      </span>
                    </div>
                  </div>

                  {/* Summary Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Package</p>
                      <p className="font-semibold">{getPackageName(booking.package)}</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="font-semibold">{booking.location || 'Not specified'}</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Contact</p>
                      <p className="font-semibold">{booking.phone || booking.email || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gray-800/70 p-4 rounded-lg mb-4">
                    <h4 className="font-bold text-[#FFCF40] mb-3">Payment Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-300 text-sm">Total Amount</p>
                        <p className="text-xl font-bold">{formatCurrency(paymentInfo.totalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Amount Paid</p>
                        <p className="text-xl font-bold text-green-400">{formatCurrency(paymentInfo.paidAmount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Balance</p>
                        <p className={`text-xl font-bold ${paymentInfo.balance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {formatCurrency(paymentInfo.balance)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="mt-4 border-t border-gray-700 pt-4">
                      <h4 className="font-bold text-lg mb-3 text-[#FFCF40]">Booking Details</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Booking Specific Details */}
                        <div>
                          <h5 className="font-semibold mb-2 text-gray-300">Event Information</h5>
                          {booking.type === 'Wedding' && (
                            <div className="space-y-1 text-sm">
                              <p><span className="text-gray-400">Customer:</span> {booking.customerName}</p>
                              <p><span className="text-gray-400">Bride:</span> {booking.brideName}</p>
                              <p><span className="text-gray-400">Groom:</span> {booking.groomName}</p>
                              <p><span className="text-gray-400">Reception Date:</span> {formatDate(booking.receptionDate)}</p>
                              <p><span className="text-gray-400">Number of Guests:</span> {booking.numberOfGuests}</p>
                            </div>
                          )}
                          {booking.type === 'Birthday' && (
                            <div className="space-y-1 text-sm">
                              <p><span className="text-gray-400">Child's Name:</span> {booking.childName}</p>
                              <p><span className="text-gray-400">Parent's Name:</span> {booking.parentName}</p>
                              <p><span className="text-gray-400">Child's Age:</span> {booking.age}</p>
                              <p><span className="text-gray-400">Theme:</span> {booking.theme || 'Not specified'}</p>
                            </div>
                          )}
                          {booking.type === 'Puberty' && (
                            <div className="space-y-1 text-sm">
                              <p><span className="text-gray-400">Girl's Name:</span> {booking.girlName}</p>
                              <p><span className="text-gray-400">Booking Date:</span> {formatDate(booking.bookingDate)}</p>
                              <p><span className="text-gray-400">Outfit Changes:</span> {booking.outfitChange || 'Not specified'}</p>
                            </div>
                          )}
                        </div>

                        {/* Payment Details */}
                        <div>
                          <h5 className="font-semibold mb-2 text-gray-300">Payment Information</h5>
                          {paymentInfo.hasPayment ? (
                            <div className="space-y-1 text-sm">
                              <p><span className="text-gray-400">Payment ID:</span> {paymentInfo.paymentId?.slice(-8)}</p>
                              <p><span className="text-gray-400">Last Payment Date:</span> {formatDate(paymentInfo.paymentDate)}</p>
                              <p><span className="text-gray-400">Status:</span> 
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${paymentInfo.colorClass}`}>
                                  {paymentInfo.status}
                                </span>
                              </p>
                              <p><span className="text-gray-400">Amount Due:</span> 
                                <span className={`ml-2 font-bold ${paymentInfo.balance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                  {formatCurrency(paymentInfo.balance)}
                                </span>
                              </p>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-gray-400">No payment information available</p>
                              <p className="text-sm text-gray-500 mt-1">Contact studio for payment details</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Notes Section */}
                      {booking.notes && (
                        <div className="mt-4">
                          <h5 className="font-semibold mb-2 text-gray-300">Additional Notes</h5>
                          <div className="bg-gray-800/50 p-3 rounded-lg text-sm">
                            {booking.notes}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-6 flex justify-end space-x-3">
                        {paymentInfo.balance > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/make-payment', {
                                state: {
                                  bookingId: booking._id,
                                  bookingType: booking.type,
                                  customerName: getCustomerName(booking),
                                  phone: booking.phone,
                                  eventDate: booking.eventDate,
                                  eventType: booking.type,
                                  totalAmount: paymentInfo.totalAmount || 0,
                                  paidAmount: paymentInfo.paidAmount || 0,
                                  balance: paymentInfo.balance
                                }
                              });
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition"
                          >
                            Make Payment
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(booking._id, booking.type);
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Toggle Button */}
                  <div className="text-center mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookingDetails(booking._id);
                      }}
                      className="text-[#FFCF40] hover:text-yellow-300 text-sm font-medium"
                    >
                      {isExpanded ? 'Show Less' : 'Show More Details'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookingsPage;