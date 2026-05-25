exports.handler = async function(event) {

  const body = JSON.parse(event.body);

  try {

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "Authorization":
            `Bearer ${process.env.GROQ_API_KEY}`
        },

        body: JSON.stringify({

          model: "llama-3.1-8b-instant",

          messages: [
            {
              role: "system",
              content: body.systemPrompt
            },
            {
              role: "user",
              content: body.input
            }
          ]

        })

      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {

    return {
      statusCode: 500,

      body: JSON.stringify({
        error: err.message
      })
    };
  }
};
