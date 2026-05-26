module.exports = {
  name: "export",
  category: "basic",
  description: "Exports project data",

  async execute(message, args) {
    const client = message.client;

    const allowedUsers = (process.env.ALLOWED_USERS || "")
      .split(",")
      .filter(Boolean);

    if (!allowedUsers.includes(message.author.id)) {
      return message.channel.send("No permission to use this command.");
    }

    if (client.exportSession) {
      return message.channel.send(
        "An export is already pending confirmation. Please wait."
      );
    }

    const session = {
      userId: message.author.id,
      channelId: message.channel.id,
      timeout: null
    };

    client.exportSession = session;

    message.channel.send("Confirm export? type !y or !n (30s timeout)");

    session.timeout = setTimeout(() => {
      if (!client.exportSession) return;

      if (client.exportSession.userId === session.userId) {
        message.channel.send("No response received. Export cancelled.");
        client.exportSession = null;
      }
    }, 30000);
  }
};