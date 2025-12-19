import express from "express";
import ExpenseModel from '../models/Expense.js'
const router = express.Router();



router.post("/Pay", async (req, res) => {
    try {
      const { customerName, mobileNumber, eventDate, eventType, totalAmount, paymentAmount, paymentDate } = req.body;
      
      // Validation
      if (!customerName || !mobileNumber || !eventDate || !eventType || !totalAmount || !paymentAmount || !paymentDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const payment = new ExpenseModel({
        customerName,
        mobileNumber,
        eventDate,
        eventType,
        totalAmount,
        paymentAmount,
        paymentDate
      });
  
      await payment.save();
      
      res.status(201).json({
        message: "Payment created successfully",
        payment
      });
      
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  


// router.get("/getpay/user/:userId", async (req, res) => {
//     try {
      
//         const payments = await ExpenseModel.find({ userId: req.params.userId });
        
//         res.json({
//             success: true,
//             payments: payments,
//             count: payments.length
//         });

//     } catch (err) {
//         console.error("Error getting payments:", err);
//         res.status(500).json({
//             success: false,
//             message: "Failed to get payments"
//         });
//     }
// });


router.get("/getpay", async (req, res) => {
    try {
      const expenses = await ExpenseModel.find({});
      res.status(200).json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ message: "Error fetching expenses" });
    }
  });


router.get("/getpay/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const payment = await ExpenseModel.findById(id);
        if (!payment) {
            return res.status(404).json({ message: "Details  Not available" });
        }
        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: "Error  ", error: err });
    }
});


router.delete("/deletePay/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deletePay = await ExpenseModel.findByIdAndDelete(id);
        if (!deletePay) {
            return res.status(404).json({ message: " not found" });
        }
        res.json({ message: "Stock details deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting ", error: err });
    }
});

router.put("/updatepay/:id", async (req, res) => {
    const id = req.params.id;
    const { customerName, mobileNumber, eventDate, eventType, totalAmount, paymentAmount, paymentDate } = req.body;

    try {
        const updatepay = await ExpenseModel.findByIdAndUpdate(
            id, 
            { customerName, mobileNumber, eventDate, eventType, totalAmount, paymentAmount, paymentDate }  , 
            { new: true } 
        );
        if (!updatepay) {
            return res.status(404).json({ message: " not found" });
        }
        res.json(updatepay);
    } catch (err) {
        res.status(500).json({ message: "Error updating ", error: err });
    }
});

export default router;
