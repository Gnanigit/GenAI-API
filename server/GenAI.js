import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
// Use cors middleware
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await model.generateContent(prompt);
    const generatedText = response.response.text();
    console.log("Generated content:", generatedText);
    res.json({ result: generatedText });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
