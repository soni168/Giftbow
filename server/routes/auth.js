const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const { sendOTP } = require("../config/email");
require("../config/passport");

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// @POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    // ✅ Bug 1 Fix — Verified user block karo, unverified ko new OTP do
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user;

    if (existingUser && !existingUser.isVerified) {
      // Pehle se hai but verify nahi hua — update kar do
      existingUser.password = hashedPassword;
      existingUser.otp = {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      };
      user = await existingUser.save();
    } else {
      // Bilkul naya user
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp: {
          code: otp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
        isVerified: false,
      });
    }

    try {
      await sendOTP(email, otp);
      console.log("OTP sent successfully! ✅");
    } catch (emailError) {
      console.error("EMAIL ERROR:", emailError.message);
    }

    res.status(201).json({
      message: "OTP sent! Email check karo!",
      userId: user._id,
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/auth/verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Bug 2 Fix — dono ko string banao compare karne se pehle
    if (user.otp.code !== String(otp)) {
      return res.status(400).json({ message: "Galat OTP!" });
    }

    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expire ho gaya!" });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Bug 3 Fix — unverified user ko login mat karo
    if (!user.isVerified) {
      return res.status(400).json({ message: "Pehle email verify karo!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({ message: "Logged out successfully" });
});

// @GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("savedGifts");
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
});

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    generateToken(res, req.user._id);
    res.redirect(process.env.CLIENT_URL);
  }
);

module.exports = router;