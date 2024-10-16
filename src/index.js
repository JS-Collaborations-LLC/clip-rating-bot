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
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
};

// Connect to MongoDB
connectDB().then(async () => {
  try {
    // Test database operations
    const testInteractionId = 'test-interaction-' + Date.now();
    const testMessageId = 'test-message-' + Date.now();
    const testClip = await db.storeClip('https://example.com', 'Test clip', '123456789', testInteractionId, testMessageId);
    console.log('Test clip stored:', testClip);

    const allClips = await db.getAllClips();
    console.log('All clips:', allClips);
  } catch (error) {
    console.error('Database test failed:', error);
  }
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
