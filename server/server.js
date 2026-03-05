const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cron = require("node-cron");
const axios = require("axios");
const connectDB = require("./config/db");
require("./config/passport");
connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const giftRoutes = require("./routes/gifts");
const chatRoutes = require("./routes/chat");

app.use("/api/auth", authRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/products", productRoutes);


app.get("/", (req, res) => {
  res.send("Giftbow API is running 🌈");
});

cron.schedule("0 */12 * * *", async () => {
  console.log("🔄 Auto-fetching trending gifts...");
  try {
    await axios.get("http://localhost:5000/api/products/refresh");
    console.log("✅ Gifts auto-fetched!");
  } catch (error) {
    console.error("❌ Auto-fetch failed:", error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});