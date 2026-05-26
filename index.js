require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
  Client,
  GatewayIntentBits,
  Collection
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
client.views = new Map();

const commandsPath = path.join(__dirname, "commands");

function loadCommands(dir) {

  const entries = fs.readdirSync(dir);

  for (const entry of entries) {

    const fullPath = path.join(dir, entry);

    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {

      loadCommands(fullPath);

    } else if (entry.endsWith(".js")) {

      delete require.cache[require.resolve(fullPath)];

      const command = require(fullPath);

      if (
        command?.name &&
        typeof command.execute === "function"
      ) {
        client.commands.set(command.name, command);
      } else {
        console.log(`Invalid command file: ${entry}`);
      }
    }
  }
}

loadCommands(commandsPath);

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
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

  if (!command) {
    return message.reply("Command does not exist.");
  }

  const allowedUsers = process.env.ALLOWED_USERS.split(",");

  if (!allowedUsers.includes(message.author.id)) {
    return message.reply("No permission to use this command.");
  }

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("Command execution failed.");
  }
});

client.login(process.env.TOKEN);