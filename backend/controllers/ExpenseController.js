import express from "express";
import ExpenseModel from '../models/Expense.js';

const router = express.Router();

// POST endpoint - Create payment
router.post("/Pay", async (req, res) => {
  try {
    console.log("Received payment request:", req.body); // Add logging
    
    const { 
      customerName, 
      mobileNumber, 
      eventDate, 
      eventType, 
      totalAmount, 
      paymentAmount, 
      paymentDate 
    } = req.body;
    
    // Validation with better error messages
    if (!customerName) return res.status(400).json({ message: "Customer name is required" });
    if (!mobileNumber) return res.status(400).json({ message: "Mobile number is required" });
    if (!eventDate) return res.status(400).json({ message: "Event date is required" });
    if (!eventType) return res.status(400).json({ message: "Event type is required" });
    if (!totalAmount) return res.status(400).json({ message: "Total amount is required" });
    if (!paymentAmount) return res.status(400).json({ message: "Payment amount is required" });
    if (!paymentDate) return res.status(400).json({ message: "Payment date is required" });

    // Convert amounts to numbers
    const payment = new ExpenseModel({
      customerName,
      mobileNumber,
      eventDate: new Date(eventDate),
      eventType,
      totalAmount: Number(totalAmount),
      paymentAmount: Number(paymentAmount),
      paymentDate: new Date(paymentDate),
      createdAt: new Date()
    });

    const savedPayment = await payment.save();
    console.log("Payment saved successfully:", savedPayment._id);
    
    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment: savedPayment
    });
    
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
});

// GET all expenses
router.get("/getpay", async (req, res) => {
  try {
    const expenses = await ExpenseModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      expenses: expenses,
      count: expenses.length
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching expenses" 
    });
  }
});

// GET single expense by ID
router.get("/getpay/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const payment = await ExpenseModel.findById(id);
    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: "Payment not found" 
      });
    }
    res.json({
      success: true,
      payment: payment
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Error fetching payment", 
      error: err.message 
    });
  }
});

// UPDATE expense
router.put("/updatepay/:id", async (req, res) => {
  const id = req.params.id;
  const { 
    customerName, 
    mobileNumber, 
    eventDate, 
    eventType, 
    totalAmount, 
    paymentAmount, 
    paymentDate 
  } = req.body;

  try {
    const updatepay = await ExpenseModel.findByIdAndUpdate(
      id, 
      { 
        customerName, 
        mobileNumber, 
        eventDate: new Date(eventDate),
        eventType, 
        totalAmount: Number(totalAmount), 
        paymentAmount: Number(paymentAmount), 
        paymentDate: new Date(paymentDate),
        updatedAt: new Date()
      }, 
      { new: true }
    );
    
    if (!updatepay) {
      return res.status(404).json({ 
        success: false,
        message: "Payment not found" 
      });
    }
    
    res.json({
      success: true,
      message: "Payment updated successfully",
      payment: updatepay
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Error updating payment", 
      error: err.message 
    });
  }
});

// DELETE expense
router.delete("/deletePay/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletePay = await ExpenseModel.findByIdAndDelete(id);
    if (!deletePay) {
      return res.status(404).json({ 
        success: false,
        message: "Payment not found" 
      });
    }
    res.json({ 
      success: true,
      message: "Payment deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Error deleting payment", 
      error: err.message 
    });
  }
});

export default router;