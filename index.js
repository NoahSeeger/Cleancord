document.addEventListener("DOMContentLoaded", async () => {
  // Check for OAuth code first
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    console.log("Code received from Discord, exchanging for token...");
    await exchangeCodeForToken(code);
    return;
  }

  // Check for existing token
  const token = localStorage.getItem("discord_token");
  if (token) {
    window.location.replace("app.html");
    return;
  }

  // Set up login buttons
  try {
    const response = await fetch("/.netlify/functions/get-auth-url");
    const { url: loginUrl } = await response.json();

    const ctaButton = document.querySelector(".cta-button");
    const navLoginButton = document.querySelector(".nav-login");

    if (ctaButton) ctaButton.href = loginUrl;
    if (navLoginButton) navLoginButton.href = loginUrl;
  } catch (error) {
    console.error("Error setting up auth:", error);
  }
});

async function exchangeCodeForToken(code) {
  try {
    console.log("Exchanging code for token...");
    const response = await fetch("/.netlify/functions/token-exchange", {
      method: "POST",
      body: JSON.stringify({ code }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    const data = await response.json();
    if (!data.access_token) {
      throw new Error("No access token received");
    }

    localStorage.setItem("discord_token", data.access_token);
    console.log("Token received and stored, redirecting to app.html");
    window.location.replace("app.html");
  } catch (error) {
    console.error("Token exchange error:", error);
  }
}
