import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// GROQ API KEY
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
          model: "llama-3.1-8b-instant",
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

    if (data.error) {
      return res.status(500).json({
        error: data.error.message
      });
    }

    res.json({
      response: data.choices[0].message.content
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "AI request failed"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
