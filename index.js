// Constants for Discord OAuth (only non-sensitive info)
const CLIENT_ID = "1320071721579184200";
const REDIRECT_URI = encodeURIComponent(
  "https://cleancord.netlify.app/index.html"
);
const SCOPES = ["identify", "guilds", "guilds.members.read", "guilds.join"];

// Create the OAuth URL
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
    const response = await fetch("/.netlify/functions/token-exchange", {
      method: "POST",
      body: JSON.stringify({ code }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const tokenData = await response.json();
      localStorage.setItem("discord_token", tokenData.access_token);
      window.location.href = "app.html";
    } else {
      console.error("Failed to exchange code for token");
    }
  } catch (error) {
    console.error("Error exchanging code for token:", error);
  }
}
