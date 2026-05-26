const fs = require("fs");
const path = require("path");

module.exports = {
  name: "help",
  description: "Shows available commands",

  async execute(message, args) {
    const category = (args[0] || "").toLowerCase();

    const basePath = path.join(__dirname);

    // -----------------------------
    // !help (no args) → categories
    // -----------------------------
    if (!category) {
      return message.channel.send(
        "Available categories:\n- basic\n- git\n\nUsage: !help <category>"
      );
    }

    // -----------------------------
    // BASIC COMMANDS
    // -----------------------------
    if (category === "basic") {
      const files = fs.readdirSync(basePath)
        .filter(f =>
          f.endsWith(".js") &&
          f !== "git.js" &&
          f !== "help.js"
        );

      let output = "BASIC COMMANDS\n\n";

      for (const file of files) {
        const cmd = require(path.join(basePath, file));

        output += `!${cmd.name}`;

        if (cmd.description) {
          output += ` - ${cmd.description}`;
        }

        output += "\n";
      }

      return message.channel.send("```\n" + output + "\n```");
    }

    // -----------------------------
    // GIT COMMANDS (folder-based)
    // -----------------------------
    if (category === "git") {
      const gitPath = path.join(basePath, "git");

      if (!fs.existsSync(gitPath)) {
        return message.channel.send("No git commands folder found.");
      }

      const files = fs.readdirSync(gitPath)
        .filter(f => f.endsWith(".js"));

      let output = "GIT COMMANDS\n\n";

      for (const file of files) {
        const cmd = require(path.join(gitPath, file));

        output += `!git ${cmd.name}`;

        if (cmd.description) {
          output += ` - ${cmd.description}`;
        }

        output += "\n";
      }

      return message.channel.send("```\n" + output + "\n```");
    }

    // -----------------------------
    // INVALID CATEGORY
    // -----------------------------
    return message.channel.send("Unknown category. Use: basic | git");
  }
};