const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["men", "women", "unisex"],
      required: true,
    },
    occasion: {
      type: String,
      enum: ["birthday", "anniversary", "festival", "wedding", "just because"],
      required: true,
    },
    buyLink: {
      type: String,
      required: true,
    },
  source: {
  type: String,
  enum: ["manual", "pinterest", "amazon"],
  default: "manual",
},isTrending: {
  type: Boolean,
  default: false,
},
trendingScore: {
  type: Number,
  default: 0,
},
views: { type: Number, default: 0 },
saves: { type: Number, default: 0 },
clicks: { type: Number, default: 0 },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Gift", giftSchema);