// Main bot file 
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');
const { loadCommands } = require('./commandHandler');
const { loadEvents } = require('./eventHandler');
const config = require('./config/config');
const { connectDB, db } = require('./database/db');

// Load environment variables
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands and events
client.commands = new Collection();
loadCommands(client);
loadEvents(client);

// Connect to MongoDB and start the bot
async function startBot() {
  try {
    await connectDB();
    
    if (process.env.CREATE_TEST_CLIP === 'true') {
      const testInteractionId = generateUniqueId();
      const testMessageId = generateUniqueId();

      const testClip = await db.storeClip('https://example.com', 'Test clip', '123456789', testInteractionId, testMessageId);
      console.log('Test clip stored:', testClip);

      const allClips = await db.getAllClips();
      console.log('All clips:', allClips);
    }

    // Login to Discord with your client's token
    try {
      await client.login(process.env.DISCORD_TOKEN);
      console.log('Bot is now online!');
    } catch (error) {
      console.error('Error logging in to Discord:', error);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error starting the bot:', error);
    process.exit(1);
  }
}

startBot();
