const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      // not required — Google OAuth users ka password nahi hoga
    },
    googleId: {
      type: String,
    },
    avatar: {
      type: String,
    },
    savedGifts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gift",
      },
    ],
       isAdmin: {
       type: Boolean,
       default: false,
    },
    preferences: {
      gender: { type: String, enum: ["men", "women", "unisex"], default: "unisex" },
      budget: { type: String, default: "all" },
      occasions: [{ type: String }],
    },
    otp: {
  code: String,
  expiresAt: Date,
},
isVerified: {
  type: Boolean,
  default: false,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);