import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// ⚠️ API KEY DIRECT
const GROQ_API_KEY = "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";

app.post("/chat", async (req, res) => {

  const userMessage = req.body.message;

  try {

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "user", content: userMessage }
          ]
        })
      }
    );

    const data = await response.json();

    res.json({
      response: data.choices[0].message.content
    });

  } catch (error) {

    res.status(500).json({
      error: "AI request failed"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});