export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const prompt = req.body.prompt;

  if (!prompt) {
    res.status(400).json({ error: "Missing prompt in request body" });
    return;
  }

  try {
    const response = await fetch(
      "https://api.generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-turbo/chat:generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer AIzaSyDoTQKMJOL6UgNKMDfBpk3CFQC2Frd70dQ`, // your Gemini API key here
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
      const error = await response.text();
      res.status(500).json({ error });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

