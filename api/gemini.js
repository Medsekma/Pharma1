export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Only allow POST requests
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  try {
    const response = await fetch(
      "https://api.generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-turbo/chat:generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`, // Make sure you add this env var in Vercel!
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
      return res.status(500).json({ error });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
