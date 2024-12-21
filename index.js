// Constants for Discord OAuth (only non-sensitive info)
const CLIENT_ID = "1320071721579184200";
const REDIRECT_URI = encodeURIComponent(
  "https://cleancord.netlify.app/app.html"
);
const SCOPES = ["identify", "guilds", "guilds.members.read", "guilds.join"];

// Create the OAuth URL
const loginUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(
  "+"
)}`;

document.addEventListener("DOMContentLoaded", () => {
  // Check if we're returning from Discord OAuth
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    // We have a code, exchange it for a token
    exchangeCodeForToken(code);
    return;
  }

  // Check if user is already logged in
  const token = localStorage.getItem("discord_token");
  if (token) {
    window.location.href = "app.html";
    return;
  }

  // Set up login buttons
  const ctaButton = document.querySelector(".cta-button");
  const navLoginButton = document.querySelector(".nav-login");

  if (ctaButton) ctaButton.href = loginUrl;
  if (navLoginButton) navLoginButton.href = loginUrl;
});

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
