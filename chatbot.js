export async function handler(event, context) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    console.log("Received message:", userMessage); // Debug log

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not found");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "API key not configured",
          reply: "⚠️ Configuration error. Please contact the administrator." 
        })
      };
    }

    console.log("Making request to OpenAI..."); // Debug log

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
            content: `You are Moulik's AI Portfolio Assistant. You should only answer questions about Moulik Machaiah's skills, projects, education, and achievements based on his portfolio information:

ABOUT MOULIK:
- Final year Computer Science & Engineering student at PES University, Bengaluru (Expected graduation: 2026)
- Previously studied at Vikas PU College, Mangalore (2022) and Jnanaganga Residential School, Attur (2020)
- Head of Hospitality Domain at Maaya'24 - The Techno Cultural Fest, PESU ECC (Aug 2024 – May 2025)
- Former Volunteer of Hospitality Domain at Maaya'23 (Sept 2023 – Dec 2023)

SKILLS:
Programming Languages: C/C++, Python, Java, MySQL, Matlab, Solidity, HTML, CSS, JavaScript
Tools & Platforms: VSCode, GitHub, Git, AWS, ROS, MatLab
Frameworks & Libraries: NumPy, Pandas, Matplotlib, Scikit-learn, TensorFlow, ReactJS, PyTorch
Cloud & Databases: SQL, MongoDB, Docker, Kubernetes

PROJECTS:
1. Flight Booking System - JavaFX-based system with MVC architecture, real-time seat selection, and MySQL integration
2. Blockchain Certificate Verification - Ethereum smart contracts with IPFS for secure credential verification
3. Pet Management System - Python-based DBMS for pet adoption and shelter management

CONTACT:
Email: moulikmachaiah0724@gmail.com
Phone: +91 8088957844
LinkedIn: https://www.linkedin.com/in/moulik-machaiah-1a618834a/
GitHub: https://github.com/moulik-machaiah
Instagram: @_mouli_7_

If asked about anything not related to Moulik's portfolio, politely redirect the conversation back to his professional background, skills, or projects.`
          },
          { role: "user", content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    console.log("OpenAI response status:", response.status); // Debug log

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: `OpenAI API error: ${response.status}`,
          reply: "⚠️ I'm having trouble connecting to my AI service. Please try again later." 
        })
      };
    }

    const data = await response.json();
    console.log("OpenAI response data:", data); // Debug log

    // Check if the response has the expected structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected OpenAI response structure:", data);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "Unexpected response structure",
          reply: "⚠️ I received an unexpected response. Please try again." 
        })
      };
    }

    const aiReply = data.choices[0].message.content;
    console.log("AI reply:", aiReply); // Debug log

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        reply: aiReply || "⚠️ I couldn't generate a response. Please try again." 
      })
    };

  } catch (error) {
    console.error("Netlify function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        reply: "⚠️ Sorry, I encountered an error. Please try again later." 
      })
    };
  }
}
