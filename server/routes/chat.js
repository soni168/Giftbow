const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const Chat = require("../models/Chat");
const Gift = require("../models/Gift");
const { protect } = require("../middleware/authMiddleware");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", protect, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message empty hai!" });
    }

    // ✅ Bug 1 Fix — limit kam karo aur sirf relevant fields lo
    const gifts = await Gift.find({}).limit(20).select("title price category occasion isTrending");
    const giftsContext = gifts.map(g =>
      `${g.title} | ${g.category} | ${g.occasion} | ₹${g.price}${g.isTrending ? " | Trending" : ""}`
    ).join("\n");

    const systemPrompt = `Tu Giftbow ka AI gift assistant hai.
Tera kaam hai users ko perfect gifts suggest karna.
Sirf neeche diye gaye Giftbow database se gifts suggest kar.
Hinglish mein baat kar — friendly aur helpful tone rakho.

Giftbow Gift Database:
${giftsContext}

User ki baat sun, unka budget, occasion aur preferences samjho, phir best gifts suggest karo database se.`;

    // Get or create chat
    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = await Chat.create({ userId, messages: [] });
    }

    // ✅ Bug 2 Fix — history slice karo current message se PEHLE
    // Aur current message history mein include mat karo
    const history = chat.messages.slice(-10).map(m => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.content,
    }));

    // ✅ Bug 3 Fix — Groq pehle call karo, save baad mein
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message }, // sirf ek baar
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    // Dono messages ek saath save karo — sirf Groq success ke baad
    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "model", content: aiResponse });
    await chat.save();

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("CHAT ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/history", protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user._id });
    if (!chat) return res.json({ messages: [] });
    res.json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/clear", protect, async (req, res) => {
  try {
    await Chat.findOneAndDelete({ userId: req.user._id });
    res.json({ message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;