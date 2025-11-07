import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/ // You can customize the pattern as needed
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['Wedding', 'Birthday', 'Corporate', 'Other'] // Add more if necessary
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { timestamps: true });


const ExpenseModel = mongoose.model("Expense", expenseSchema);

export default ExpenseModel;


