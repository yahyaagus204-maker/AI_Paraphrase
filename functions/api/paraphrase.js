export async function onRequestPost(context) {

  try {

    const body = await context.request.json();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "Authorization":
            `Bearer ${context.env.GROQ_API_KEY}`
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

    return Response.json(data);

  } catch (err) {

    return Response.json({
      error: err.message
    }, {
      status: 500
    });

  }
      }
