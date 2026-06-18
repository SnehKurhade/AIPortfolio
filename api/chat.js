import Groq from "groq-sdk";

export default async function handler(req, res) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: req.body.messages
  });

  res.status(200).json({
    content: completion.choices[0].message.content
  });
}