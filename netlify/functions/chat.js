export async function handler(event, context) {
  const body = JSON.parse(event.body);
  const userMessage = body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 🔴 Replace with your actual key
        "Authorization": `Bearer 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`
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
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };

  } catch (error) {
    console.error("Netlify function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong with AI." })
    };
  }
}
