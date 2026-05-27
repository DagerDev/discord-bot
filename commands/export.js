module.exports = {
  name: "export",
  category: "basic",
  description: "Exports project data",

  async execute(message) {

    const client =
      message.client;

    const allowedUsers =
      (process.env.ALLOWED_USERS || "")
        .split(",")
        .filter(Boolean);

    if (
      !allowedUsers.includes(
        message.author.id
      )
    ) {

      return message.channel.send(
        "No permission to use this command."
      );

    }

    if (client.exportSession) {

      return message.channel.send(
        "An export is already pending confirmation."
      );

    }

    const session = {
      userId: message.author.id,
      channelId: message.channel.id,
      timeout: null,
      createdAt: Date.now()
    };

    client.exportSession =
      session;

    const lines = [
      "EXPORT CONFIRMATION",
      "",
      "Project export requested.",
      "",
      "Type:",
      "!y  - Confirm export",
      "!n  - Cancel export",
      "",
      "Timeout: 30 seconds"
    ];

    await message.channel.send(
      "```txt\n" +
      lines.join("\n") +
      "\n```"
    );

    session.timeout =
      setTimeout(() => {

        if (
          !client.exportSession
        ) return;

        if (
          client.exportSession.userId ===
          session.userId
        ) {

          message.channel.send(
            "Export cancelled (timeout)."
          );

          client.exportSession = null;

        }

      }, 30000);

  }
};