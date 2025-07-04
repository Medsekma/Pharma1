export default async function handler(req, res) {
  const { GEMINI_API_KEY } = process.env;

  if (!GEMINI_API_KEY) {
    res.status(500).json({ error: "Missing Gemini API key in environment" });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed, use POST" });
    return;
  }

  const prompt = req.body.prompt;

  if (!prompt || prompt.trim() === "") {
    res.status(400).json({ error: "No prompt provided" });
    return;
  }

  try {
    const response = await fetch(
      "https://api.generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-turbo/chat:generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GEMINI_API_KEY}`,
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
      res.status(500).json({ error: `Gemini API error: ${errorText}` });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
}
