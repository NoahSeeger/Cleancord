// const CLIENT_ID = "1320071721579184200";

// const loginUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5500%2Findex.html&scope=identify+guilds+guilds.members.read`;

// document.getElementById("login-button").addEventListener("click", () => {
//   window.location.href = loginUrl;
// });

// // First, make sure we have a container for our content
// function createContainers() {
//   const mainContainer = document.createElement("div");
//   mainContainer.className = "main-container";
//   mainContainer.innerHTML = `
//     <div class="mode-selection" style="display: none;">
//       <div id="server-count"></div>
//       <h3>Choose Display Mode:</h3>
//       <button id="quick-mode" class="mode-button">Quick Mode (Basic Info)</button>
//       <button id="detailed-mode" class="mode-button">Detailed Mode (With Join Dates)</button>
//       <div id="loading-status"></div>
//       <div class="loading-spinner" style="display: none;"></div>
//     </div>
//     <div class="server-lists-container" style="display: none;">
//       <div id="owned-servers">
//         <h3 class="list-title">Servers You Own</h3>
//         <div class="server-list"></div>
//       </div>
//       <div id="member-servers">
//         <h3 class="list-title">Servers You're In</h3>
//         <div class="server-list"></div>
//       </div>
//     </div>
//   `;
//   document.body.appendChild(mainContainer);
// }

// // Call this when the page loads
// createContainers();

// function showLoginStatus(message, isSuccess = true) {
//   const statusElement = document.querySelector(".login-status");
//   statusElement.textContent = message;
//   statusElement.className = `login-status ${isSuccess ? "success" : "error"}`;

//   if (isSuccess) {
//     document.querySelector(".mode-selection").style.display = "block";
//     document.querySelector(".hero-section").style.display = "none";
//     document.querySelector(".server-lists-container").style.display = "block";
//   }
// }

// document.addEventListener("DOMContentLoaded", async () => {
//   const token = localStorage.getItem("discord_token");

//   if (!token) {
//     // No token found, redirect to hero page
//     window.location.href = "hero.html";
//     return;
//   }

//   // Verify token and fetch servers
//   try {
//     // Create containers first
//     createContainers();

//     // Fetch server data using the token
//     const response = await fetch(
//       "https://discord.com/api/v10/users/@me/guilds",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (response.ok) {
//       const servers = await response.json();
//       console.log("Successfully fetched servers:", servers.length);
//       displayServers(servers, token);
//     } else {
//       console.error("Failed to fetch servers, status:", response.status);
//       localStorage.removeItem("discord_token");
//       window.location.href = "hero.html";
//     }
//   } catch (error) {
//     console.error("Error fetching servers:", error);
//     localStorage.removeItem("discord_token");
//     window.location.href = "hero.html";
//   }
// });

// async function displayServers(servers, accessToken) {
//   const mainContainer = document.createElement("div");
//   mainContainer.className = "main-container";

//   // Show mode selection
//   document.querySelector(".mode-selection").style.display = "block";

//   const serverList = document.getElementById("server-list");
//   const serverCount = document.getElementById("server-count");
//   const quickModeBtn = document.getElementById("quick-mode");
//   const detailedModeBtn = document.getElementById("detailed-mode");
//   const loadingStatus = document.getElementById("loading-status");

//   // Update server count
//   serverCount.textContent = `Total Servers: ${servers.length}`;

//   // Add event listeners to mode buttons
//   quickModeBtn.addEventListener("click", () => displayMode("quick"));
//   detailedModeBtn.addEventListener("click", () => displayMode("detailed"));

//   // Rest of your displayServers function...
// }

// // Helper function to create server element
// function createServerElement(server) {
//   const serverItem = document.createElement("div");
//   serverItem.className = "server-item";

//   const serverIcon = document.createElement("img");
//   serverIcon.className = "server-icon";
//   serverIcon.src = server.icon
//     ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`
//     : "https://cdn.discordapp.com/embed/avatars/0.png";

//   const serverInfo = document.createElement("div");
//   serverInfo.className = "server-info";

//   const serverName = document.createElement("div");
//   serverName.className = "server-name";
//   serverName.textContent = server.name;

//   const serverDetails = document.createElement("div");
//   serverDetails.className = "server-details";

//   serverInfo.appendChild(serverName);
//   serverInfo.appendChild(serverDetails);
//   serverItem.appendChild(serverIcon);
//   serverItem.appendChild(serverInfo);

//   return serverItem;
// }

// // Helper function for sleeping
// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
