const express = require("express");
const router = express.Router();
const axios = require("axios");
const Gift = require("../models/Gift");

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

const giftKeywords = [
  { query: "birthday gifts for women", category: "women", occasion: "birthday" },
  { query: "birthday gifts for men", category: "men", occasion: "birthday" },
  { query: "anniversary gifts", category: "unisex", occasion: "anniversary" },
  { query: "wedding gifts india", category: "unisex", occasion: "wedding" },
  { query: "festival gifts india", category: "unisex", occasion: "festival" },
  { query: "luxury gifts for her", category: "women", occasion: "birthday" },
  { query: "tech gifts for him", category: "men", occasion: "birthday" },
  { query: "gifts for girlfriend", category: "women", occasion: "just because" },
  { query: "gifts for boyfriend", category: "men", occasion: "just because" },
  { query: "gifts for mom", category: "women", occasion: "just because" },
  { query: "gifts for dad", category: "men", occasion: "just because" },
  { query: "personalised gifts india", category: "unisex", occasion: "birthday" },
];

const fetchAndSave = async ({ query, category, occasion }, page = "1") => {
  const response = await axios.get(
    "https://real-time-amazon-data.p.rapidapi.com/search",
    {
      params: {
        query,
        page,
        country: "IN",
        sort_by: "RELEVANCE",
        product_condition: "ALL",
      },
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    }
  );

  const products = response.data.data.products;

  const gifts = products
    .filter((p) => p.product_photo && p.product_price && p.product_url)
    .slice(0, 10)
    .map((p) => ({
      title: p.product_title?.slice(0, 60),
      description: p.product_title,
      price: parseFloat(p.product_price.replace(/[^0-9.]/g, "")) || 999,
      imageUrl: p.product_photo,
      category,
      occasion,
      buyLink: p.product_url,
      source: "amazon",
      isTrending: true,
      trendingScore: Math.floor(Math.random() * 40) + 60,
    }));

  let saved = 0;
  for (const gift of gifts) {
    const exists = await Gift.findOne({ title: gift.title });
    if (!exists) {
      await Gift.create(gift);
      saved++;
    }
  }
  return saved;
};

/* =========================
   🔥 REFRESH FUNCTION
========================= */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const refreshAllProducts = async () => {
  let totalSaved = 0;

  for (const keyword of giftKeywords) {
    for (const page of ["1", "2", "3"]) {
      try {
        const saved = await fetchAndSave(keyword, page);
        totalSaved += saved;
        console.log(`✅ ${keyword.query} page ${page} — saved: ${saved}`);
      } catch (err) {
        console.error(`Failed: ${keyword.query} page ${page} — ${err.message}`);
      }

      await sleep(1500); // ← Har request ke baad 1.5 second ruko
    }

    await sleep(3000); // ← Har keyword ke baad 3 second ruko
  }

  return totalSaved;
};

/* =========================
   ROUTES
========================= */

router.get("/fetch", async (req, res) => {
  try {
    const keyword = giftKeywords[Math.floor(Math.random() * giftKeywords.length)];
    const saved = await fetchAndSave(keyword, "1");
    res.json({ message: `${saved} gifts fetched & saved!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/refresh", async (req, res) => {
  try {
    const totalSaved = await refreshAllProducts();
    res.json({ message: `Total ${totalSaved} new gifts saved!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { router, refreshAllProducts };