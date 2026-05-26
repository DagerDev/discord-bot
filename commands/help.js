const fs = require("fs");
const path = require("path");

module.exports = {
  name: "help",
  description: "Shows available commands",

  async execute(message, args) {

    const category =
      (args[0] || "").toLowerCase();

    const basePath = __dirname;

    // -----------------------------
    // !help
    // -----------------------------
    if (!category) {

      return message.channel.send(
        "Available categories:\n- basic\n- git"
      );

    }

    // -----------------------------
    // BASIC
    // -----------------------------
    if (category === "basic") {

      const files =
        fs.readdirSync(basePath)
          .filter(file =>
            file.endsWith(".js") &&
            file !== "git.js" &&
            file !== "help.js"
          );

      let output =
        "BASIC COMMANDS\n\n";

      for (const file of files) {

        try {

          const cmd =
            require(path.join(basePath, file));

          output += `!${cmd.name}`;

          if (cmd.description) {
            output += ` - ${cmd.description}`;
          }

          output += "\n";

        } catch (err) {

          console.error(
            `Failed loading ${file}`,
            err
          );

        }

      }

      return message.channel.send(
        "```\n" + output + "\n```"
      );

    }

    // -----------------------------
    // GIT
    // -----------------------------
    if (category === "git") {

      const gitPath =
        path.join(basePath, "git");

      if (!fs.existsSync(gitPath)) {

        return message.channel.send(
          "Git folder not found."
        );

      }

      const files =
        fs.readdirSync(gitPath)
          .filter(file =>
            file.endsWith(".js")
          );

      let output =
        "GIT COMMANDS\n\n";

      for (const file of files) {

        try {

          const cmd =
            require(path.join(gitPath, file));

          output += `!git ${cmd.name}`;

          if (cmd.description) {
            output += ` - ${cmd.description}`;
          }

          output += "\n";

        } catch (err) {

          console.error(
            `Failed loading git/${file}`,
            err
          );

        }

      }

      return message.channel.send(
        "```\n" + output + "\n```"
      );

    }

    // -----------------------------
    // INVALID
    // -----------------------------
    return message.channel.send(
      "Unknown category."
    );

  }
};