# Discord Link Moderator Bot

A Discord bot that automatically detects and removes links from users who don't have permission to post them, then applies a 1-week timeout.

## Features

✅ Automatically detects URLs in messages  
✅ Deletes messages with links from unauthorized users  
✅ Applies a 1-week timeout to violators  
✅ Exempts administrators and moderators  
✅ Role-based permissions system  
✅ Comprehensive error handling  
✅ Channel exemptions (optional)  

## Prerequisites

- **Node.js** version 16.9.0 or higher (Download: https://nodejs.org/)
- A **Discord account** with server admin permissions
- Basic command line knowledge

## Setup Instructions

### 1. Create Your Discord Bot

1. Go to the Discord Developer Portal: https://discord.com/developers/applications
2. Click "New Application" and give it a name
3. Go to the "Bot" tab on the left sidebar
4. Click "Add Bot" and confirm
5. Under the bot's username, click "Reset Token" and copy your bot token (save it securely!)

### 2. Configure Bot Permissions & Intents

Still in the Developer Portal:

#### Enable Intents (IMPORTANT!)
1. Scroll down to "Privileged Gateway Intents"
2. Enable the following:
   - MESSAGE CONTENT INTENT (required to read message content)
   - SERVER MEMBERS INTENT (required to timeout users)

#### Set Bot Permissions
1. Go to the "OAuth2" → "URL Generator" tab
2. Under SCOPES, select: bot
3. Under BOT PERMISSIONS, select:
   - Manage Messages (to delete messages)
   - Moderate Members (to timeout users)
   - Read Messages/View Channels
   - Send Messages (for notifications)
   - Read Message History

4. Copy the generated URL at the bottom
5. Paste it in your browser and invite the bot to your server

### 3. Install the Bot

1. Download/extract the bot files to a folder on your computer

2. Open a terminal/command prompt in that folder

3. Install dependencies:
   npm install

4. Create a .env file (copy from .env.example):
   On Windows: copy .env.example .env
   On Mac/Linux: cp .env.example .env

5. Edit the .env file and add your bot token:
   DISCORD_TOKEN=your_actual_bot_token_here

### 4. Configure the Bot

Open link-moderator-bot.js and modify the CONFIG section (lines 11-20).

Change ALLOWED_ROLE_NAME to match your server's role name.

To exempt specific channels:
1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click a channel and select "Copy Channel ID"
3. Add the ID to EXEMPT_CHANNELS array

### 5. Create the Role in Discord

1. In your Discord server, go to Server Settings → Roles
2. Create a new role named exactly as specified in ALLOWED_ROLE_NAME (e.g., "Trusted")
3. Assign this role to users who should be allowed to post links

### 6. Run the Bot

Start the bot with: npm start

You should see a success message with the bot's name.

## How It Works

### Who Can Post Links?
✅ Users with the configured role (e.g., "Trusted")  
✅ Server administrators  
✅ Users with "Manage Messages" permission  
✅ The bot itself (won't moderate other bots)  

### What Happens When an Unauthorized User Posts a Link?
1. Message is immediately deleted
2. User receives a 1-week timeout (cannot send messages, react, or join voice)
3. A notification is sent (auto-deletes after 10 seconds)
4. Action is logged to the console

### Link Detection
The bot detects:
- Standard URLs (https://example.com, http://site.org)
- WWW links (www.example.com)
- Discord invites (discord.gg/abc123)
- Common domains without http/https (google.com, youtube.com, etc.)

## Troubleshooting

### "Missing Permissions" Error
- Ensure the bot's role is above the roles of users it's trying to timeout
- Check that the bot has Moderate Members and Manage Messages permissions

### Bot Doesn't Detect Links
- Verify MESSAGE CONTENT INTENT is enabled in the Developer Portal
- Restart the bot after enabling intents

### "Cannot timeout this user"
- Bot cannot timeout server owners or administrators
- Bot cannot timeout users with roles higher than its own
- Move the bot's role higher in the role hierarchy

## Security Notes

⚠️ Never share your bot token!  
⚠️ Add .env to .gitignore if using Git  
⚠️ Regenerate your token if it's exposed  

## License

MIT License - feel free to modify and use as needed!
