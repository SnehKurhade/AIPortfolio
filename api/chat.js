import Groq from "groq-sdk";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed"
      });
    }

    console.log("API Key exists:", !!process.env.GROQ_API_KEY);
    console.log("Request body:", req.body);

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: req.body.messages,
    });

    return res.status(200).json({
      content: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("Groq Error:", error);

    return res.status(500).json({
      error: error.message,
      details: error,
    });
  }
}