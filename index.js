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

client.commands = new Collection();

// load commands
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// ready
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// message handler
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const prefixes = ["¿", "!"];

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

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.channel.send("Command error.");
  }
});

client.login(process.env.TOKEN);