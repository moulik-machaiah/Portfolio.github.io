export async function handler(event, context) {
  try {
    let body = {};
    if (event.body) {
      body = JSON.parse(event.body);
    }

    const userMessage = body.message || "";

    if (!userMessage) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "👋 Hello! This is Moulik’s AI Portfolio Assistant. Please ask me something about Moulik’s projects, skills, or education."
        })
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
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
    console.log("🔎 OpenAI Response:", JSON.stringify(data, null, 2)); // 👈 logs to Netlify

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "⚠️ OpenAI returned no response."
      })
    };

  } catch (error) {
    console.error("Netlify function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong with AI." })
    };
  }
}
