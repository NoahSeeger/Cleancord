document.addEventListener("DOMContentLoaded", async () => {
  // Check if we're returning from Discord OAuth
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    // We have a code, exchange it for a token
    await exchangeCodeForToken(code);
    return;
  }

  // Check if user is already logged in
  const token = localStorage.getItem("discord_token");
  if (token) {
    try {
      // Verify token is valid
      const response = await fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        window.location.replace("app.html");
        return;
      } else {
        localStorage.removeItem("discord_token");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      localStorage.removeItem("discord_token");
    }
  }

  // Set up login buttons with auth URL from server
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
      window.location.replace("app.html");
    } else {
      console.error("Failed to exchange code for token");
    }
  } catch (error) {
    console.error("Error exchanging code for token:", error);
  }
}
