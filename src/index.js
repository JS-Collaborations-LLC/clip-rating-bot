// Main bot file 
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');
const { loadCommands } = require('./commandHandler');
const { loadEvents } = require('./eventHandler');

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

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
