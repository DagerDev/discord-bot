const os = require("os");
const { version } = require("discord.js");

module.exports = {
  name: "info",

  async execute(message, args) {
    const client = message.client;

    const uptime = process.uptime();
    const memory = process.memoryUsage().heapUsed / 1024 / 1024;

    const servers = client.guilds.cache.size;

    const output =
`BOT INFO

Bot tag: ${client.user.tag}
Discord.js: ${version}

Servers: ${servers}
Uptime: ${Math.floor(uptime)}s

Memory usage: ${memory.toFixed(2)} MB

Node version: ${process.version}
Platform: ${os.platform()}`;

    message.channel.send("```\n" + output + "\n```");
  }
};