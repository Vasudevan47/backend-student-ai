import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ⚠️ Put your Groq API key here
const GROQ_API_KEY = "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";

// Test route
app.get("/", (req, res) => {
  res.send("AI Chatbot Backend Running");
});

// Chat endpoint
app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices) {
      return res.status(500).json({
        error: "Invalid response from AI"
      });
    }

    const aiReply = data.choices[0].message.content;

    res.json({
      response: aiReply
    });

  } catch (error) {

    console.error("AI Error:", error);

    res.status(500).json({
      error: "AI request failed"
    });

  }

});

// Render uses dynamic port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
