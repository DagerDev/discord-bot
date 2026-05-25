require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  const prefixes = ["!", "¿"];

  const usedPrefix = prefixes.find(p =>
    message.content.startsWith(p)
  );

  if (!usedPrefix) return;

  const args = message.content
    .slice(usedPrefix.length)
    .trim()
    .split(/ +/);

  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  // Invalid command
  if (!command) {
    return message.reply(
      "❌ Invalid command."
    );
  }

  // Permission check
  const allowedUsers =
    process.env.ALLOWED_USERS.split(",");

  if (!allowedUsers.includes(message.author.id)) {
    return message.reply(
      "❌ No permission to use this command."
    );
  }

  try {
    await command.execute(message, args);

  } catch (error) {

    console.error(error);

    message.reply(
      "❌ Command execution failed."
    );

  }

});