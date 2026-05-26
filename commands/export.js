const axios = require("axios");

// Only ONE active export confirmation globally
let activeExport = null;

module.exports = {
  name: "export",

  async execute(message, args) {
    const allowedUsers = (process.env.ALLOWED_USERS || "")
      .split(",")
      .filter(Boolean);

    if (!allowedUsers.includes(message.author.id)) {
      return message.channel.send(
        "You do not have permission to use this command."
      );
    }

    // Block if another export is already waiting
    if (activeExport) {
      return message.channel.send(
        "An export is already pending confirmation. Please wait."
      );
    }

    // Create active export session
    activeExport = {
      userId: message.author.id,
      channelId: message.channel.id,
      timeout: null
    };

    message.channel.send("Confirm export? type !y or !n (30s timeout)");

    // Store globally for index.js access
    message.client.exportSession = activeExport;

    // Timeout handler
    activeExport.timeout = setTimeout(() => {
      if (activeExport && activeExport.userId === message.author.id) {
        message.channel.send(
          "No response received. Export cancelled."
        );

        activeExport = null;
        message.client.exportSession = null;
      }
    }, 30000);
  }
};