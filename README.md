# Cleancord - Discord Server Manager

A clean and simple web application to manage your Discord servers. Built with Discord's OAuth2 API, this tool helps users organize and manage their Discord server memberships.

## Features

- 🔐 Secure Discord OAuth2 authentication
- 📊 Overview of all joined Discord servers
- 👑 Separate view for owned and joined servers
- 📅 Detailed server information including join dates
- 🔄 Smart rate limit handling
- 📱 Fully responsive design
- ⚡ Quick and detailed viewing modes

## Setup

1. Clone the repository
2. Create a `.env` file in the root directory with your Discord application credentials
3. Set up your Discord Application:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Set up OAuth2 credentials
   - Add your redirect URI
   - Copy the Client ID and Client Secret to your `.env` file

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Discord OAuth2 API

## Project Structure

cleancord/
├── .env # Environment variables (not in repo)
├── .gitignore # Git ignore file
├── README.md # This file
├── index.html # Landing page
├── app.html # Main application page
├── styles.css # Landing page styles
├── app-styles.css # Application styles
├── index.js # OAuth2 and landing page logic
├── app.js # Main application logic
└── Logo.png # Application logo

## Features in Detail

### Quick Mode

- Basic server information
- Server icons
- Ownership status
- Fast loading

### Detailed Mode

- All Quick Mode features
- Server join dates
- Progress tracking
- Rate limit handling
- Estimated loading times

## Security

This application uses OAuth2 for secure authentication. No Discord tokens or sensitive information are stored permanently.

## Support

For support, please open an issue in the GitHub repository.

---

Made with ❤️ by Cleancord
