exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { code } = JSON.parse(event.body);
    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No code provided" }),
      };
    }

    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Failed to get access token",
          details: tokenData,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(tokenData),
    };
  } catch (error) {
    console.error("Token exchange error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to exchange code for token" }),
    };
  }
};
