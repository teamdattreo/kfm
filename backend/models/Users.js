// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     address: String,
//     password: String,
//     cpassword: String,
//     mobile: String
// });



// const UserModel = mongoose.model("kusers", UserSchema);

// export default UserModel;
// backend/models/User.js

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  authProvider: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  },
  address: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    required: function() { return this.authProvider === 'email'; }
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    match: [/^[0-9]{10}$/, "Mobile number must be 10 digits"]
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date
}, {
  timestamps: true
});

const UserModel = mongoose.model("kusers", UserSchema);

export default UserModel;
