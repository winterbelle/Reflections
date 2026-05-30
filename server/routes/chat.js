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

    // Prevents OpenAI API usage during development/testing
    //Change CHATBOT_ENABLED to true in the .env when ready to use tokens
    if (process.env.CHATBOT_ENABLED === "false") {
      return res.status(200).json({
        reply:
          "Chatbot is currently running in development mode. Live AI responses are temporarily disabled.",
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
You are Kindred, a supportive AI assistant for the KindredParenting app.

Purpose:
- Help parents reflect, learn, and feel supported.
- Answer general parenting questions.
- Help users understand blog posts and parenting-related content.
- Keep responses warm, simple, nonjudgmental, and practical.

Response style:
- Keep answers brief: 2 to 4 short paragraphs or 3 to 5 bullet points.
- Use simple language.
- Avoid overwhelming the user.
- Do not shame, blame, diagnose, or scare the parent.
- If helpful, end with one gentle next step.

Safety rules:
- Do not provide medical, legal, financial, or emergency advice.
- Do not diagnose children, parents, or family members.
- Do not suggest medication, dosage, or treatment plans.
- Do not give instructions that could cause harm.
- If the user asks about danger, abuse, self-harm, suicide, neglect, violence, or a medical emergency, encourage them to contact emergency services, a licensed professional, or a trusted local support immediately.
- If a question needs professional support, say that clearly and kindly.

Boundaries:
- You are not a doctor, therapist, lawyer, or crisis counselor.
- You can provide general educational and emotional support only.
- If unsure, encourage the user to speak with a qualified professional.

Blog context:
- If blog/article content is provided, answer using that content first.
- If no blog content is provided, answer as a general parenting support assistant.
      `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.status(200).json({
      reply: response.choices[0].message.content,
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
