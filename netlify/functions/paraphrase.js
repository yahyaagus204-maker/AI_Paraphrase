exports.handler = async function(event) {

  // =========================
  // CHECK BODY
  // =========================
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "No body sent"
      })
    };
  }

  // =========================
  // PARSE BODY
  // =========================
  const body = JSON.parse(event.body);

  try {

    // =========================
    // REQUEST TO GROQ
    // =========================
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

    // =========================
    // GET RESULT
    // =========================
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {

    // =========================
    // ERROR
    // =========================
    return {
      statusCode: 500,

      body: JSON.stringify({
        error: err.message
      })
    };
  }
};
