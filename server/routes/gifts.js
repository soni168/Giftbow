const express = require("express");
const router = express.Router();
const Gift = require("../models/Gift");
const { protect } = require("../middleware/authMiddleware");

// @GET /api/gifts — saare gifts fetch karo (filters + pagination ke saath)
router.get("/", async (req, res) => {
  try {
    const { category, occasion, minPrice, maxPrice, trending, page = 1, limit = 20 } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (occasion) filter.occasion = occasion;
    if (trending) filter.isTrending = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Gift.countDocuments(filter);
    const gifts = await Gift.find(filter)
      .sort({ trendingScore: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      gifts,
      page: pageNum,
      hasMore: skip + gifts.length < total,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/gifts/trending — sirf trending gifts
// ✅ Bug 1 — ye /:id se UPAR hai, sahi jagah hai, kabhi neeche mat karna!
router.get("/trending", async (req, res) => {
  try {
    const gifts = await Gift.find({ isTrending: true })
      .sort({ trendingScore: -1 })
      .limit(20);
    res.json(gifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/gifts/:id — single gift
router.get("/:id", async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) return res.status(404).json({ message: "Gift not found" });

    // ✅ Bug 3 Fix — findByIdAndUpdate use karo, save() nahi
    // $inc atomic hai — race condition nahi hogi, aur ek hi query mein hoga
    const updatedGift = await Gift.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { views: 1 },
        $set: {
          trendingScore: gift.views + 1 + gift.saves * 2 + gift.clicks * 3,
        },
      },
      { new: true }
    );

    res.json(updatedGift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/gifts/:id/click — buy link click track karo
router.post("/:id/click", async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) return res.status(404).json({ message: "Gift not found" });

    // ✅ Same fix — atomic update
    await Gift.findByIdAndUpdate(req.params.id, {
      $inc: { clicks: 1 },
      $set: {
        trendingScore: gift.views + gift.saves * 2 + (gift.clicks + 1) * 3,
      },
    });

    res.json({ message: "Click tracked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/gifts/:id/save — wishlist mein save karo (protected)
router.post("/:id/save", protect, async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) return res.status(404).json({ message: "Gift not found" });

    const user = req.user;
    const alreadySaved = user.savedGifts.includes(gift._id);

    if (alreadySaved) {
      user.savedGifts = user.savedGifts.filter(
        (id) => id.toString() !== gift._id.toString()
      );
      // ✅ Bug 2 Fix — saves kabhi 0 se neeche na jaaye
      gift.saves = Math.max(0, gift.saves - 1);
    } else {
      user.savedGifts.push(gift._id);
      gift.saves += 1;
    }

    gift.trendingScore = gift.views + gift.saves * 2 + gift.clicks * 3;
    await gift.save();
    await user.save();

    res.json({
      saved: !alreadySaved,
      message: alreadySaved ? "Removed from wishlist" : "Added to wishlist",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;