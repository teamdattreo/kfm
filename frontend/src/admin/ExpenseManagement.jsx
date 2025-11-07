import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEventType, setFilterEventType] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    eventDate: '',
    eventType: 'Wedding',
    totalAmount: '',
    paymentAmount: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });

  const [editingId, setEditingId] = useState(null);
  const eventTypes = ['Wedding', 'Birthday', 'Corporate', 'Photoshoot', 'Other'];
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    setAuthChecked(true);


    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/ExpenseController/getpay');
        setExpenses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setLoading(false);
        setMessage('Failed to load expenses');
      }
    };

    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const payload = {
        customerName: formData.customerName,
        mobileNumber: formData.mobileNumber,
        eventDate: formData.eventDate,
        eventType: formData.eventType,
        totalAmount: Number(formData.totalAmount),
        paymentAmount: formData.paymentAmount ? Number(formData.paymentAmount) : 0,
        paymentDate: formData.paymentDate
      };

      if (editingId) {
        await axios.put(`http://localhost:4000/ExpenseController/updatepay/${editingId}`, payload);
        setMessage('Expense updated successfully');
      } else {
        await axios.post('http://localhost:4000/ExpenseController/Pay', payload);
        setMessage('Expense added successfully');
      }

      // Refresh data
      const response = await axios.get('http://localhost:4000/ExpenseController/getpay');
      setExpenses(response.data);
      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
      setMessage(`Error: ${error.response?.data?.message || 'Failed to save expense'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      mobileNumber: '',
      eventDate: '',
      eventType: 'Wedding',
      totalAmount: '',
      paymentAmount: '',
      paymentDate: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (expense) => {
    setFormData({
      customerName: expense.customerName,
      mobileNumber: expense.mobileNumber,
      eventDate: expense.eventDate,
      eventType: expense.eventType,
      totalAmount: expense.totalAmount.toString(),
      paymentAmount: expense.paymentAmount?.toString() || '',
      paymentDate: expense.paymentDate || new Date().toISOString().split('T')[0]
    });
    setEditingId(expense._id);
    setShowForm(true);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`http://localhost:4000/ExpenseController/deletePay/${id}`);
        setExpenses(expenses.filter(exp => exp._id !== id));
        setMessage('Expense deleted successfully');
      } catch (error) {
        console.error('Error deleting expense:', error);
        setMessage('Failed to delete expense');
      }
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         expense.mobileNumber.includes(searchTerm);
    const matchesType = filterEventType === 'All' || expense.eventType === filterEventType;
    return matchesSearch && matchesType;
  });

  const totalBalance = expenses.reduce((sum, expense) => sum + (expense.totalAmount - (expense.paymentAmount || 0)), 0);
  const totalPaid = expenses.reduce((sum, expense) => sum + (expense.paymentAmount || 0), 0);

  const generatePDF = (expense) => {
    const doc = new jsPDF();
    let y = 20;

    // Background and border
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(15, 15, 180, 267);

    doc.setDrawColor(150);
    doc.setLineWidth(0.5);
    doc.rect(18, 18, 174, 261);

    doc.setFontSize(20);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Expense Receipt", 105, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text("Powered by Studio Management System", 105, 37, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("EXPENSE DETAILS", 105, 55, { align: 'center' });

    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Generated on: ${date}`, 25, 70);
    doc.text(`Ref #: ${expense._id.slice(-8)}`, 150, 70);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.line(25, 75, 185, 75);

    y = 85;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text("Customer Information", 25, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`Name: ${expense.customerName || 'N/A'}`, 30, y);
    doc.text(`Mobile: ${expense.mobileNumber || 'N/A'}`, 110, y);
    y += 6;
    doc.text(`Event Date: ${new Date(expense.eventDate).toLocaleDateString() || 'N/A'}`, 30, y);
    doc.text(`Event Type: ${expense.eventType || 'N/A'}`, 110, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Payment Details", 25, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.text(`Total Amount: LKR ${expense.totalAmount.toLocaleString()}`, 30, y);
    y += 6;
    doc.text(`Amount Paid: LKR ${(expense.paymentAmount || 0).toLocaleString()}`, 30, y);
    y += 6;
    doc.text(`Balance: LKR ${(expense.totalAmount - (expense.paymentAmount || 0)).toLocaleString()}`, 30, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Payment Information", 25, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.text(`1. ${new Date(expense.paymentDate).toLocaleDateString()}: LKR ${(expense.paymentAmount || 0).toLocaleString()}`, 30, y);
    y += 6;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for choosing our studio services.", 105, y, { align: 'center' });

    doc.save(`expense_${expense._id.slice(-8)}.pdf`);
  };

  const colorTheme = {
    card: 'bg-gray-800',
    accent: 'bg-amber-600 hover:bg-amber-700',
    muted: 'text-gray-400',
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className={`${colorTheme.card} rounded-xl p-8 mb-6 shadow-lg`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-amber-400 mb-4 md:mb-0">
              Studio Expense Management
            </h1>
            <div className="flex space-x-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border border-gray-700 rounded-md bg-gray-700 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="px-4 py-2 border border-gray-700 rounded-md bg-gray-700 text-white"
                value={filterEventType}
                onChange={(e) => setFilterEventType(e.target.value)}
              >
                <option value="All">All Types</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-md ${
              message.includes('success') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              {message}
            </div>
          )}

          <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4 bg-amber-600 text-white flex justify-between items-center">
              <h2 className="text-lg font-semibold">Expense Summary</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className={`px-4 py-2 ${colorTheme.accent} rounded-md`}
              >
                {showForm ? 'Hide Form' : 'Add New Expense'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              <div className="bg-gray-800 p-4 rounded-md">
                <h3 className="text-gray-400 font-medium">Total Expenses</h3>
                <p className="text-2xl font-bold text-white">
                  LKR {expenses.reduce((sum, exp) => sum + exp.totalAmount, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-900 p-4 rounded-md">
                <h3 className="text-green-300 font-medium">Total Paid</h3>
                <p className="text-2xl font-bold text-green-300">
                  LKR {totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-900 p-4 rounded-md">
                <h3 className="text-red-300 font-medium">Total Balance</h3>
                <p className="text-2xl font-bold text-red-300">
                  LKR {totalBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {showForm && (
            <div className={`${colorTheme.card} rounded-lg shadow-md p-6 mb-6`}>
              <h2 className="text-lg font-semibold mb-4 text-amber-400">
                {editingId ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Event Type
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                    >
                      {eventTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Total Amount (LKR)
                    </label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                      value={formData.paymentAmount}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                      value={formData.paymentDate}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm border border-gray-700 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className={`px-5 py-2.5 text-sm font-medium text-white ${colorTheme.accent} rounded-md`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : (editingId ? 'Update Expense' : 'Add Expense')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-800 border-b border-gray-600">
              <h2 className="text-lg font-semibold text-white">Expense Records</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-700 divide-y divide-gray-600">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-600">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {expense.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {expense.mobileNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(expense.eventDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${expense.eventType === 'Wedding' ? 'bg-purple-900 text-purple-300' :
                            expense.eventType === 'Birthday' ? 'bg-blue-900 text-blue-300' :
                            expense.eventType === 'Corporate' ? 'bg-green-900 text-green-300' :
                            'bg-yellow-900 text-yellow-300'}`}>
                          {expense.eventType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        LKR {expense.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        LKR {(expense.paymentAmount || 0).toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold 
                        ${(expense.totalAmount - (expense.paymentAmount || 0)) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        LKR {(expense.totalAmount - (expense.paymentAmount || 0)).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-amber-400 hover:text-amber-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => generatePDF(expense)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagement;