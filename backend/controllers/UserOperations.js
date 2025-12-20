import express from "express";
import UserModel from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-strong-secret-key";
const BACKEND_URL = process.env.BACKEND_URL || "https://kfm.onrender.com";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://www.studiokfm.com";

// Debug logs
console.log("ENV BACKEND_URL:", BACKEND_URL);
console.log("ENV FRONTEND_URL:", FRONTEND_URL);

// Middleware to authenticate user by token
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token required" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Check for disposable email
const isDisposableEmail = async (email) => {
  const domain = email.split("@")[1];
  try {
    const response = await axios.get(`https://disposable.debounce.io/?email=${domain}`);
    return response.data.disposable === "true";
  } catch {
    return false;
  }
};

// Send email with backend URL
const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${BACKEND_URL}/UserOperations/verify-email?token=${token}`;
  console.log("🔗 Email link sent:", verificationLink);

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false }
  });

  const mailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div>
        <h2>Welcome!</h2>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationLink}" style="padding:10px 20px; background:#4CAF50; color:white; text-decoration:none;">Verify Email</a>
        <p>Or paste this link: <br>${verificationLink}</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, mobile, authProvider = "email" } = req.body;
    if (!name || !email || !password || !address || !mobile) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (authProvider === "email" && await isDisposableEmail(email)) {
      return res.status(400).json({ success: false, message: "Disposable emails not allowed" });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const user = new UserModel({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      address,
      mobile,
      authProvider,
      verified: authProvider === "google",
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000
    });

    await user.save();

    if (authProvider === "email") {
      try {
        await sendVerificationEmail(email, verificationToken);
        return res.status(201).json({
          success: true,
          message: "Registration successful! Check your email to verify."
        });
      } catch (err) {
        await UserModel.deleteOne({ email: email.toLowerCase() });
        return res.status(500).json({ success: false, message: "Failed to send verification email" });
      }
    }

    res.status(201).json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Email verification
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.redirect(`${FRONTEND_URL}/verification-failed?reason=no_token`);
  }

  try {
    const user = await UserModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.redirect(`${FRONTEND_URL}/verification-failed?reason=invalid_token`);
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.redirect(`${FRONTEND_URL}/verification-success`);
  } catch (err) {
    console.error("Verification error:", err);
    return res.redirect(`${FRONTEND_URL}/verification-failed?reason=server_error`);
  }
});

// Login
// router.post("/login", async (req, res) => {
//   const { email, password, authProvider = "email" } = req.body;

//   try {
//     const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     if (authProvider === "google") {
//       if (user.authProvider !== "google") {
//         return res.status(400).json({ message: "Use email/password login" });
//       }
//       const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
//       return res.json({ token, user });
//     }

//     if (!user.verified) {
//       return res.status(403).json({ message: "Email not verified" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
//     res.json({ token, user });
//   } catch (err) {
//     res.status(500).json({ message: "Login failed", error: err.message });
//   }
// });

router.post("/login", async (req, res) => {
  const { email, password, authProvider = "email" } = req.body;

  try {
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Determine role using env
    const role = (user.email === process.env.ADMIN_EMAIL) ? "admin" : "user";

    if (authProvider === "google") {
      if (user.authProvider !== "google") {
        return res.status(400).json({ message: "Use email/password login" });
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

      return res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role  // <-- Return role here
        }
      });
    }

    if (!user.verified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role  // <-- Return role here too
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});


// Get profile
router.get("/getUser", authenticateUser, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password -__v");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
});

// Update profile
router.put("/update/:id", authenticateUser, async (req, res) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({ message: "Unauthorized update attempt" });
  }

  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.mobile) updates.mobile = req.body.mobile;
    if (req.body.address) updates.address = req.body.address;

    const user = await UserModel.findByIdAndUpdate(req.userId, updates, { new: true }).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, message: "Profile updated", data: user });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// Get all users (admin)
router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving users" });
  }
});

// Delete user
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const deleted = await UserModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;
