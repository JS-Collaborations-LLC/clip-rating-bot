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
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Initialize commands collection
client.commands = new Collection();

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  loadCommands(client);
});

// Handle interactionCreate event
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// Connect to MongoDB
connectDB().then(async () => {
  try {
    // Test database operations
    const testClip = await db.storeClip('https://example.com', 'Test clip', '123456789');
    console.log('Test clip stored:', testClip);

    const allClips = await db.getAllClips();
    console.log('All clips:', allClips);

    // If these operations succeed, your database is set up correctly
  } catch (error) {
    console.error('Database test failed:', error);
  }
});

// Now you can use db operations in your bot commands, for example:
// db.storeClip(url, description, submittedBy)
// db.addRating(clipId, rating, ratedBy)
// db.getAllClips()
// etc.

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
