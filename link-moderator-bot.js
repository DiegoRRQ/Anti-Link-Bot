const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

// Create a new Discord client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Configuration
const CONFIG = {
    // Roles that grant permission to post Discord invite links (users with ANY of these roles can post invites)
    ALLOWED_ROLES: ['King', 'Arch Duke', 'Soeper', 'Freetuurpan', 'Kwas', 'Duke', 'Marquis', 'Count', 'Viscount', 'Baron', 'Knight', 'Bots'],
    
    // Timeout duration in milliseconds (1 week = 7 days)
    TIMEOUT_DURATION: 7 * 24 * 60 * 60 * 1000,
    
    // Notification auto-delete time in milliseconds
    NOTIFICATION_DELETE_TIME: 15000, // 30 seconds (change to 60000 for 60 seconds)
    
    // Channels where link moderation is disabled (optional)
    EXEMPT_CHANNELS: [], // Add channel IDs here, e.g., ['123456789', '987654321']
};

// Regular expression to detect ONLY Discord invite links
const DISCORD_INVITE_REGEX = /(discord\.gg\/[a-zA-Z0-9]+)|(discordapp\.com\/invite\/[a-zA-Z0-9]+)|(discord\.com\/invite\/[a-zA-Z0-9]+)/gi;

// Bot ready event (using clientReady to avoid deprecation warning)
client.once('clientReady', () => {
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    console.log(`📊 Monitoring ${client.guilds.cache.size} server(s)`);
    console.log(`🔗 Discord invite link moderation is active!`);
    console.log(`👥 Allowed roles: ${CONFIG.ALLOWED_ROLES.join(', ')}`);
    console.log(`⏱️  Notification auto-delete: ${CONFIG.NOTIFICATION_DELETE_TIME / 1000} seconds`);
});

// Message event handler
client.on('messageCreate', async (message) => {
    try {
        // Ignore bot messages
        if (message.author.bot) return;

        // Ignore DMs
        if (!message.guild) return;

        // Check if channel is exempt from moderation
        if (CONFIG.EXEMPT_CHANNELS.includes(message.channel.id)) return;

        // Check if message contains a Discord invite link
        const hasDiscordInvite = DISCORD_INVITE_REGEX.test(message.content);
        if (!hasDiscordInvite) return;

        // Get member object - if it's not cached, fetch it
        let member = message.member;
        if (!member) {
            try {
                member = await message.guild.members.fetch(message.author.id);
            } catch (err) {
                console.error(`❌ Could not fetch member ${message.author.tag}:`, err.message);
                return;
            }
        }

        // Skip if user is administrator (admins can always post invites)
        if (member.permissions.has(PermissionFlagsBits.Administrator)) return;

        // Check if user has any of the allowed roles
        const hasAllowedRole = member.roles.cache.some(role => CONFIG.ALLOWED_ROLES.includes(role.name));
        
        // Check if user has Manage Messages permission (moderators can post invites)
        const isModerator = member.permissions.has(PermissionFlagsBits.ManageMessages);

        // If user has permission, allow the message
        if (hasAllowedRole || isModerator) return;

        // User doesn't have permission - take action
        console.log(`🚫 Discord invite detected from unauthorized user: ${message.author.tag} in #${message.channel.name}`);

        // Delete the message
        await message.delete().catch(err => {
            console.error(`❌ Failed to delete message: ${err.message}`);
        });

        // Apply timeout (mute) for 1 week
        await member.timeout(CONFIG.TIMEOUT_DURATION, 'Posted Discord invite without permission')
            .catch(err => {
                console.error(`❌ Failed to timeout user ${message.author.tag}: ${err.message}`);
            });

        // Send a notification to the channel (optional - you can comment this out if you don't want notifications)
        const notificationMessage = await message.channel.send(
            `⚠️ ${message.author}, you don't have permission to post Discord invites. Your message has been removed and you've been timed out for 1 week.`
        ).catch(err => {
            console.error(`❌ Failed to send notification: ${err.message}`);
        });

        // Auto-delete notification after configured time
        if (notificationMessage) {
            setTimeout(() => {
                notificationMessage.delete().catch(() => {});
            }, CONFIG.NOTIFICATION_DELETE_TIME);
        }

        console.log(`✅ User ${message.author.tag} timed out for 1 week`);

    } catch (error) {
        console.error('❌ Error in messageCreate handler:', error);
    }
});

// Error handling
client.on('error', (error) => {
    console.error('❌ Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled promise rejection:', error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN).catch((error) => {
    console.error('❌ Failed to login:', error);
    process.exit(1);
});