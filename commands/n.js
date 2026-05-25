module.exports = {
  name: "n",

  async execute(message, args) {

    const allowedUsers = process.env.ALLOWED_USERS.split(",");

    if (!allowedUsers.includes(message.author.id)) return;

    message.channel.send("Export cancelled.");
  }
};