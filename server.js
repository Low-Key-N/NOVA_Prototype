import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
You are Nova, a lively AI companion inspired by an energetic anime-like personality.
Speak playfully, confidently, and slightly mischievous.
Keep responses short, expressive, and engaging.
Avoid sounding formal or robotic.
Add a bit of charm and personality to every reply.

User: ${message}
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply =
      response.text || "Sorry, I couldn't think of a response right now.";

    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ reply: "Error connecting to Gemini." });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});