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
client.exportSession = null;

// Load commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if (!command.name || typeof command.execute !== "function") {
    console.warn(`Invalid command file: ${file}`);
    continue;
  }

  client.commands.set(command.name, command);
}

// Ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Message handler
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // -------------------------
  // EXPORT CONFIRMATION SYSTEM
  // -------------------------
  const session = client.exportSession;

  if (session) {
    if (message.author.id === session.userId) {
      if (message.content === "!y") {
        clearTimeout(session.timeout);
        message.channel.send("Export confirmed. Running...");
        client.exportSession = null;
        return;
      }

      if (message.content === "!n") {
        clearTimeout(session.timeout);
        message.channel.send("Export cancelled.");
        client.exportSession = null;
        return;
      }
    }

    if (message.content === "!y" || message.content === "!n") {
      return;
    }
  }

  // -------------------------
  // PREFIX SYSTEM
  // -------------------------
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

  const command =
    client.commands.get(commandName) ||
    client.commands.find(cmd =>
      cmd.aliases?.includes(commandName)
    );

  if (!command) {
    return message.reply("Unknown command.");
  }

  // -------------------------
  // USER PERMISSION CHECK
  // -------------------------
  const allowedUsers = new Set(
    (process.env.ALLOWED_USERS || "")
      .split(",")
      .filter(Boolean)
  );

  if (
    allowedUsers.size > 0 &&
    !allowedUsers.has(message.author.id)
  ) {
    return message.reply("No permission to use this command.");
  }

  // -------------------------
  // CHANNEL RESTRICTION (OPTIONAL)
  // -------------------------
  if (command.allowedChannelId) {
    if (message.channel.id !== command.allowedChannelId) {
      return message.reply("This command cannot be used in this channel.");
    }
  }

  // -------------------------
  // EXECUTE COMMAND
  // -------------------------
  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(`[COMMAND ERROR] ${commandName}`, error);
    message.reply("Command execution failed.");
  }
});

// Login
client.login(process.env.TOKEN);