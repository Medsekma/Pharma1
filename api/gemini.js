// /api/gemini.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, POST only" });
  }

  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  try {
    const response = await fetch(
      "https://api.generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-turbo/chat:generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer AIzaSyDoTQKMJOL6UgNKMDfBpk3CFQC2Frd70dQ`,
        },
        body: JSON.stringify({
          model: "gemini-1.5-turbo",
          temperature: 0,
          maxTokens: 500,
          messages: [{ author: "user", content: prompt }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return res.status(500).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
