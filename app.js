document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("discord_token");
  console.log("App.js - Token check:", token ? "Token exists" : "No token");

  if (!token) {
    window.location.replace("index.html");
    return;
  }

  try {
    // Update nav and verify token
    await updateNavAuth();

    // Create containers for server display
    createContainers();

    // Fetch server data
    const response = await fetch(
      "https://discord.com/api/v10/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const servers = await response.json();
      console.log("Successfully fetched servers:", servers.length);
      displayServers(servers, token);
    } else {
      throw new Error("Failed to fetch servers");
    }
  } catch (error) {
    console.error("App.js - Error:", error);
    localStorage.removeItem("discord_token");
    window.location.replace("index.html");
  }
});

function createContainers() {
  const mainContainer = document.createElement("div");
  mainContainer.className = "main-container";
  mainContainer.innerHTML = `
        <div class="mode-selection">
            <div id="server-count"></div>
            <h3>Choose Display Mode:</h3>
            <button id="quick-mode" class="mode-button">Quick Mode (Basic Info)</button>
            <button id="detailed-mode" class="mode-button">Detailed Mode (With Join Dates)</button>
            <div id="loading-status"></div>
            <div class="loading-spinner" style="display: none;"></div>
        </div>
        <div class="server-lists-container">
            <div id="owned-servers">
                <div class="list-header">
                    <h3 class="list-title">Servers You Own</h3>
                    <button class="collapse-button">▼</button>
                </div>
                <div class="server-list"></div>
            </div>
            <div id="member-servers">
                <div class="list-header">
                    <h3 class="list-title">Servers You're In</h3>
                    <div class="view-controls">
                        <button class="view-toggle list-view active" title="List View">
                            <span>📝</span>
                        </button>
                        <button class="view-toggle grid-view" title="Grid View">
                            <span>📱</span>
                        </button>
                        <select class="sort-select" id="sort-servers">
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="members">Member Count</option>
                            <option value="joined">Join Date</option>
                        </select>
                    </div>
                </div>
                <div class="server-list list-view-active"></div>
            </div>
        </div>
    `;
  document.body.appendChild(mainContainer);

  // Add collapse functionality
  const collapseButton = mainContainer.querySelector(".collapse-button");
  const ownedServersList = mainContainer.querySelector(
    "#owned-servers .server-list"
  );

  collapseButton.addEventListener("click", () => {
    const isCollapsed = ownedServersList.style.display === "none";
    ownedServersList.style.display = isCollapsed ? "flex" : "none";
    collapseButton.textContent = isCollapsed ? "▼" : "▶";
    collapseButton.style.transform = isCollapsed
      ? "rotate(0deg)"
      : "rotate(-90deg)";
  });

  // Add sort functionality
  const sortSelect = mainContainer.querySelector("#sort-servers");
  sortSelect.addEventListener("change", () => {
    const currentMode =
      document.querySelector(".mode-button.active")?.id === "detailed-mode"
        ? "detailed"
        : "quick";
    const token = localStorage.getItem("discord_token");
    const memberServersList = document.querySelector(
      "#member-servers .server-list"
    );
    const servers = Array.from(memberServersList.children);

    sortServers(servers, sortSelect.value);
  });

  // Add view toggle functionality
  const viewToggles = mainContainer.querySelectorAll(".view-toggle");
  const serverList = mainContainer.querySelector(
    "#member-servers .server-list"
  );

  viewToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      viewToggles.forEach((t) => t.classList.remove("active"));
      toggle.classList.add("active");

      if (toggle.classList.contains("grid-view")) {
        serverList.classList.remove("list-view-active");
        serverList.classList.add("grid-view-active");
      } else {
        serverList.classList.remove("grid-view-active");
        serverList.classList.add("list-view-active");
      }
    });
  });
}

function sortServers(servers, sortType) {
  const memberServersList = document.querySelector(
    "#member-servers .server-list"
  );
  const sortedServers = [...servers].sort((a, b) => {
    const nameA = a.querySelector(".server-name").textContent;
    const nameB = b.querySelector(".server-name").textContent;

    switch (sortType) {
      case "name-asc":
        return nameA.localeCompare(nameB);
      case "name-desc":
        return nameB.localeCompare(nameA);
      case "members":
        // If we have member count data, sort by it
        const membersA = parseInt(a.dataset.memberCount) || 0;
        const membersB = parseInt(b.dataset.memberCount) || 0;
        return membersB - membersA;
      case "joined":
        // If we have join date data, sort by it
        const dateA = a.querySelector(".server-details")?.textContent || "";
        const dateB = b.querySelector(".server-details")?.textContent || "";
        return dateB.localeCompare(dateA);
      default:
        return 0;
    }
  });

  memberServersList.innerHTML = "";
  sortedServers.forEach((server) => memberServersList.appendChild(server));
}

async function displayServers(servers, token) {
  // Show mode selection
  document.querySelector(".mode-selection").style.display = "block";

  const serverCount = document.getElementById("server-count");
  const quickModeBtn = document.getElementById("quick-mode");
  const detailedModeBtn = document.getElementById("detailed-mode");

  // Update server count
  serverCount.textContent = `Total Servers: ${servers.length}`;

  // Add event listeners to mode buttons
  quickModeBtn.addEventListener("click", () =>
    displayMode("quick", servers, token)
  );
  detailedModeBtn.addEventListener("click", () =>
    displayMode("detailed", servers, token)
  );

  // Default to quick mode
  displayMode("quick", servers, token);
}

function createServerElement(server) {
  const serverItem = document.createElement("div");
  serverItem.className = "server-item";

  const serverIcon = document.createElement("img");
  serverIcon.className = "server-icon";
  serverIcon.src = server.icon
    ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`
    : "https://cdn.discordapp.com/embed/avatars/0.png";

  const serverInfo = document.createElement("div");
  serverInfo.className = "server-info";

  const serverName = document.createElement("div");
  serverName.className = "server-name";
  serverName.textContent = server.name;

  const serverDetails = document.createElement("div");
  serverDetails.className = "server-details";

  serverInfo.appendChild(serverName);
  serverInfo.appendChild(serverDetails);
  serverItem.appendChild(serverIcon);
  serverItem.appendChild(serverInfo);

  return serverItem;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Add these rate limit handling utilities
class RateLimitHandler {
  constructor() {
    this.buckets = new Map();
    this.globalReset = null;
  }

  async handleRateLimit(response, retryRequest) {
    if (response.status === 429) {
      const data = await response.json();
      const retryAfter = data.retry_after * 1000; // Convert to milliseconds
      const scope = response.headers.get("X-RateLimit-Scope");

      if (data.global || scope === "global") {
        // Handle global rate limit
        this.globalReset = Date.now() + retryAfter;
        console.log(`Global rate limit hit, waiting ${retryAfter}ms`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter));
        return retryRequest();
      } else {
        // Handle bucket-specific rate limit
        const bucket = response.headers.get("X-RateLimit-Bucket");
        if (bucket) {
          this.buckets.set(bucket, {
            reset: Date.now() + retryAfter,
            remaining: 0,
          });
        }
        console.log(
          `Rate limit hit for bucket ${bucket}, waiting ${retryAfter}ms`
        );
        await new Promise((resolve) => setTimeout(resolve, retryAfter));
        return retryRequest();
      }
    }
    return response;
  }

  async makeRequest(url, options) {
    // Check global rate limit
    if (this.globalReset && Date.now() < this.globalReset) {
      const waitTime = this.globalReset - Date.now();
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    const response = await fetch(url, options);

    // Update bucket information
    const bucket = response.headers.get("X-RateLimit-Bucket");
    if (bucket) {
      const remaining = parseInt(response.headers.get("X-RateLimit-Remaining"));
      const resetAfter =
        parseFloat(response.headers.get("X-RateLimit-Reset-After")) * 1000;

      this.buckets.set(bucket, {
        reset: Date.now() + resetAfter,
        remaining,
      });
    }

    // Handle rate limits if encountered
    return this.handleRateLimit(response, () => this.makeRequest(url, options));
  }
}

// Update the displayMode function with better progress tracking and optimized rate limiting
async function displayMode(mode, servers, token) {
  const loadingStatus = document.getElementById("loading-status");
  const loadingSpinner = document.querySelector(".loading-spinner");
  const ownedServersList = document.querySelector(
    "#owned-servers .server-list"
  );
  const memberServersList = document.querySelector(
    "#member-servers .server-list"
  );

  // Clear existing lists
  ownedServersList.innerHTML = "";
  memberServersList.innerHTML = "";

  // Create progress bar
  const progressContainer = document.createElement("div");
  progressContainer.className = "progress-container";
  progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <div class="progress-text">0%</div>
        <div class="time-estimate"></div>
    `;
  loadingStatus.appendChild(progressContainer);

  try {
    const rateLimitHandler = new RateLimitHandler();
    const ownedServers = servers.filter(
      (server) => (server.permissions & 0x8) === 0x8
    );
    const memberServers = servers.filter(
      (server) => (server.permissions & 0x8) !== 0x8
    );

    if (mode === "detailed") {
      const totalServers = ownedServers.length + memberServers.length;
      let processedServers = 0;
      let startTime = Date.now();

      // Process servers with optimized batch size and delay
      const batchSize = 2; // Reduced batch size
      const delayBetweenBatches = 1000; // 1 second delay between batches

      const updateProgress = (processed) => {
        processedServers = processed;
        const percentage = Math.round((processedServers / totalServers) * 100);
        const progressFill = progressContainer.querySelector(".progress-fill");
        const progressText = progressContainer.querySelector(".progress-text");
        const timeEstimate = progressContainer.querySelector(".time-estimate");

        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;

        // Calculate time estimate
        const elapsed = Date.now() - startTime;
        const estimatedTotal = (elapsed / processedServers) * totalServers;
        const remaining = Math.max(0, estimatedTotal - elapsed);
        const remainingMinutes = Math.ceil(remaining / 60000);

        timeEstimate.textContent = `Estimated time remaining: ${remainingMinutes} minute${
          remainingMinutes !== 1 ? "s" : ""
        }`;
      };

      const processServers = async (serverList, containerElement) => {
        for (let i = 0; i < serverList.length; i += batchSize) {
          const batch = serverList.slice(i, i + batchSize);

          // Process batch
          await Promise.all(
            batch.map(async (server) => {
              const serverElement = createServerElement(server);
              try {
                const response = await rateLimitHandler.makeRequest(
                  `https://discord.com/api/v10/users/@me/guilds/${server.id}/member`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (response.ok) {
                  const guildData = await response.json();
                  const joinDate = new Date(guildData.joined_at);
                  const details =
                    serverElement.querySelector(".server-details");
                  details.textContent = `Joined: ${joinDate.toLocaleDateString()}`;
                  serverElement.dataset.joinDate = guildData.joined_at;
                }
              } catch (error) {
                console.error(
                  `Error fetching details for server ${server.id}:`,
                  error
                );
              }
              containerElement.appendChild(serverElement);
            })
          );

          // Update progress
          updateProgress(
            i +
              batch.length +
              (serverList === memberServers ? ownedServers.length : 0)
          );

          // Add delay between batches
          if (i + batchSize < serverList.length) {
            await new Promise((resolve) =>
              setTimeout(resolve, delayBetweenBatches)
            );
          }
        }
      };

      // Process owned and member servers
      await processServers(ownedServers, ownedServersList);
      await processServers(memberServers, memberServersList);
    } else {
      // Quick mode - just show basic info
      ownedServers.forEach((server) => {
        ownedServersList.appendChild(createServerElement(server));
      });
      memberServers.forEach((server) => {
        memberServersList.appendChild(createServerElement(server));
      });
    }

    // Cleanup
    progressContainer.remove();
    loadingSpinner.style.display = "none";
    loadingStatus.textContent = `Loaded ${servers.length} servers`;
  } catch (error) {
    console.error("Error displaying servers:", error);
    progressContainer.remove();
    loadingSpinner.style.display = "none";
    loadingStatus.textContent = "Error loading server information";
  }
}

async function updateNavAuth() {
  const navAuth = document.querySelector(".nav-auth");
  const userStatus = document.querySelector(".user-status");
  const navButton = document.querySelector(".nav-login");
  const token = localStorage.getItem("discord_token");

  if (token) {
    try {
      const response = await fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        userStatus.textContent = `Logged in as ${userData.username}`;
        userStatus.style.display = "block";
        navButton.textContent = "Sign Out";
        navButton.onclick = async (e) => {
          e.preventDefault();
          await signOut(token);
        };
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("discord_token");
      window.location.replace("index.html");
    }
  }
}

async function signOut(token) {
  try {
    // Use Netlify function to revoke token
    await fetch("/.netlify/functions/revoke-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
  } catch (error) {
    console.error("Error during sign out:", error);
  }

  localStorage.removeItem("discord_token");
  window.location.replace("index.html");
}
