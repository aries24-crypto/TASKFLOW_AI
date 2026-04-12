export default async function handler(req, res) {
  // Only allow POST (basic sanity check)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, system } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();

    // Send ONLY what frontend needs
    let parsed;

try {
  parsed = JSON.parse(data.choices[0].message.content);
} catch {
  parsed = {
    reply: "AI response error",
    newTasks: [],
    modifiedTasks: []
  };
}

    return res.status(200).json(parsed);

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "Something broke" });
  }
}
