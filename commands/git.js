const fs = require("fs");
const path = require("path");

module.exports = {
  name: "git",
  description: "Git system router",

  async execute(message, args) {
    const sub = (args[0] || "").toLowerCase();

    if (!sub) {
      return message.channel.send("Usage: !git <command>");
    }

    const filePath = path.join(__dirname, "git", `${sub}.js`);

    if (!fs.existsSync(filePath)) {
      return message.channel.send("Unknown git command.");
    }

    try {
      // Clear require cache so updates work instantly
      delete require.cache[require.resolve(filePath)];

      const command = require(filePath);

      if (!command || typeof command.execute !== "function") {
        return message.channel.send("Invalid git command file.");
      }

      return command.execute(message, args.slice(1));

    } catch (err) {
      console.error(err);
      return message.channel.send("Git command failed.");
    }
  }
};