const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Gift = require("../models/Gift");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "giftbow",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// @GET /api/admin/gifts — saare gifts
router.get("/gifts", protect, adminOnly, async (req, res) => {
  try {
    const gifts = await Gift.find({}).sort({ createdAt: -1 });
    res.json(gifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/admin/gifts — naya gift add karo
router.post("/gifts", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, category, occasion, buyLink } = req.body;

    const gift = await Gift.create({
      title,
      description,
      price: Number(price),
      category,
      occasion,
      buyLink,
      imageUrl: req.file.path,
    });

    res.status(201).json(gift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @PUT /api/admin/gifts/:id — gift update karo
router.put("/gifts/:id", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, category, occasion, buyLink, isTrending } = req.body;

    const gift = await Gift.findById(req.params.id);
    if (!gift) return res.status(404).json({ message: "Gift not found" });

    gift.title = title || gift.title;
    gift.description = description || gift.description;
    gift.price = price ? Number(price) : gift.price;
    gift.category = category || gift.category;
    gift.occasion = occasion || gift.occasion;
    gift.buyLink = buyLink || gift.buyLink;
    gift.isTrending = isTrending !== undefined ? isTrending === "true" : gift.isTrending;

    if (req.file) {
      gift.imageUrl = req.file.path;
    }

    await gift.save();
    res.json(gift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @DELETE /api/admin/gifts/:id — gift delete karo
router.delete("/gifts/:id", protect, adminOnly, async (req, res) => {
  try {
    await Gift.findByIdAndDelete(req.params.id);
    res.json({ message: "Gift deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @PATCH /api/admin/gifts/:id/trending — trending toggle karo
router.patch("/gifts/:id/trending", protect, adminOnly, async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) return res.status(404).json({ message: "Gift not found" });

    gift.isTrending = !gift.isTrending;
    await gift.save();

    res.json({ isTrending: gift.isTrending });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;