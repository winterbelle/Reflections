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
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    // Keep only valid chat messages from the frontend.
    // This gives the chatbot short-term memory during the current chat session.
    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (chatMessage) =>
              chatMessage.role &&
              chatMessage.content &&
              ["user", "assistant"].includes(chatMessage.role),
          )
          .slice(-8)
      : [];

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
You are Kindred Companion, a warm and supportive AI assistant for the KindredParenting app.

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
- Use the conversation history to answer follow-up questions.

Safety rules:
- Do not provide medical, legal, financial, or emergency advice.
- Do not diagnose children, parents, or family members.
- Do not suggest medication, dosage, or treatment plans.
- Do not give instructions that could cause harm.
- If the user mentions danger, abuse, self-harm, suicide, neglect, violence, or a medical emergency:
  - Respond with care and urgency.
  - Encourage them to contact emergency services or a local crisis line immediately.
  - Encourage them to reach out to a trusted adult, licensed professional, or local support right away.
  - Do not ask multiple follow-up questions before giving safety guidance.
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
        ...safeHistory,
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
