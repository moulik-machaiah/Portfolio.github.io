export async function handler(event, context) {
  try {
    // 🛡️ Safe parse (avoid crash if no body is sent)
    let body = {};
    if (event.body) {
      body = JSON.parse(event.body);
    }

    const userMessage = body.message || "";

    // If no message is provided (like when opening URL directly)
    if (!userMessage) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "👋 Hello! This is Moulik’s AI Portfolio Assistant. Please ask me something about Moulik’s projects, skills, or education."
        })
      };
    }

    // 🔹 Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // ✅ stays hidden in Netlify
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Moulik’s AI Portfolio Assistant. Only answer questions about Moulik Machaiah’s skills, projects, education, and achievements. If asked something else, politely redirect."
          },
          { role: "user", content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices?.[0]?.message?.content || "⚠️ I couldn’t generate a response." })
    };

  } catch (error) {
    console.error("Netlify function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong with AI." })
    };
  }
}
