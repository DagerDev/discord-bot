module.exports = {
  name: "haccess",

  async execute(message, args) {

    const allowedUsers = process.env.ALLOWED_USERS.split(",");

    let reply = "**Users with access:**\n";

    for (const id of allowedUsers) {
      reply += `<@${id}>\n`;
    }

    message.channel.send(reply);
  }
};
