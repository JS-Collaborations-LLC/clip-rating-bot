# Clip Rating Bot

## Description

Clip Rating Bot is a Discord bot built with Node.js that allows users to submit gaming clips for rating and compete for a weekly coaching session prize. This bot enhances community engagement and provides a fun way for players to showcase their skills.

## Features

- Users can submit clips using a simple command
- Discord members can rate clips using reactions (1-5 stars)
- Automatic calculation of average ratings for each clip
- Weekly competition with the top-rated clip winning a coaching session
- MongoDB integration for data persistence

## How It Works

1. Users submit their clips using a designated command
2. Other members of the Discord server can rate the clips using reactions
3. The bot calculates the average rating for each clip
4. At the end of each week, the clip with the highest average rating wins
5. The winner receives a coaching session with a member of our title roster

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root directory with the following content:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   MONGODB_URI=your_mongodb_connection_string
   ```
4. Set up a MongoDB database (local or cloud-based like MongoDB Atlas)

## Usage

1. Run the bot using `npm start`
2. Use the following commands in your Discord server:
   (List your bot commands here)

## Project Structure

- `src/`: Source code directory
  - `index.js`: Main bot file
  - `commandHandler.js`: Handles command loading and execution
  - `eventHandler.js`: Handles event loading and execution
  - `config/`: Configuration files
  - `database/`: Database connection and operations
  - `utils/`: Utility functions
- `commands/`: Command files
- `events/`: Event files
- `test/`: Test scripts

## Contributing

(Guidelines for contributing to the project)

## License

(Your chosen license)

## Thanks to Contributors

- [Your Name](Your Profile Link) - Creator of the bot and developer
