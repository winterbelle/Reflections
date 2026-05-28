// ========================================
// Chat Routes
// Handles AI chatbot interactions
// ========================================

const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Temporary test route
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Chat route is working",
  });
});

// POST /chat
// Sends a user question to the AI chatbot
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are a warm, supportive parenting assistant for the KindredParenting app. You can answer parenting and blog-related questions. Do not provide medical, legal, or crisis advice. Encourage users to seek professional help when needed.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.status(200).json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to get chatbot response",
      reply:
        "I'm having trouble connecting right now, but I'm here to support you. Try asking again later, or reach out to a trusted professional if this is urgent.",
    });
  }
});

module.exports = router;