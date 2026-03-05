const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cron = require("node-cron");
const connectDB = require("./config/db");
const path = require("path");

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

const { router: productRoutes, refreshAllProducts } = require("./routes/products");
const authRoutes = require("./routes/auth");
const giftRoutes = require("./routes/gifts");
const chatRoutes = require("./routes/chat");

app.use(express.static(path.join(__dirname, "../client/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/products", productRoutes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

/* =========================
   ⏰ 12-HOUR CRON
========================= */

cron.schedule("0 */12 * * *", async () => {
  console.log("⏰ 12-hour cron triggered");

  try {
    const totalSaved = await refreshAllProducts();
    console.log(`✅ ${totalSaved} products refreshed`);
  } catch (error) {
    console.error("❌ Cron failed:", error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});