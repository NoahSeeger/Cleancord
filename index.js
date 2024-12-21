// Load environment variables (you'll need to use a server or build tool to actually use .env)
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const REDIRECT_URI = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

// Create the OAuth URL
const SCOPES = ["identify", "guilds", "guilds.members.read", "guilds.join"];
const loginUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(
  "+"
)}`;

document.addEventListener("DOMContentLoaded", () => {
  // First check if user is already logged in
  const token = localStorage.getItem("discord_token");
  if (token) {
    verifyAndRedirect(token);
    return;
  }

  // Set up login buttons
  const ctaButton = document.querySelector(".cta-button");
  const navLoginButton = document.querySelector(".nav-login");

  if (ctaButton) ctaButton.href = loginUrl;
  if (navLoginButton) navLoginButton.href = loginUrl;

  // Check for authorization code in URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    // We got an authorization code, exchange it for a token
    exchangeCodeForToken(code);
  }
});

async function verifyAndRedirect(token) {
  try {
    const response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Token is valid, redirect to app.html
      window.location.href = "app.html";
    } else {
      // Token is invalid, remove it and stay on index
      localStorage.removeItem("discord_token");
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    localStorage.removeItem("discord_token");
  }
}

async function exchangeCodeForToken(code) {
  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: decodeURIComponent(REDIRECT_URI),
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json();
      localStorage.setItem("discord_token", tokenData.access_token);
      // After getting the token, redirect to app.html
      window.location.href = "app.html";
    } else {
      console.error("Failed to exchange code for token");
    }
  } catch (error) {
    console.error("Error exchanging code for token:", error);
  }
}
