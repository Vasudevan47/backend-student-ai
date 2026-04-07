import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

const GROQ_API_KEY = "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";

app.get("/", (req, res) => {
  res.send("AI Chatbot Backend Running");
});

app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message missing" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-70b-versatile",
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

    console.log("Groq response:", data);

    const aiText = data.choices?.[0]?.message?.content || "No AI response";

    res.json({
      response: aiText
    });

  } catch (error) {

    console.error("Server error:", error);

    res.status(500).json({
      error: "AI request failed"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
