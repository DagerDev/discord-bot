const axios = require("axios");

let waitingConfirm = false;

module.exports = {
  name: "export",

  async execute(message, args) {
    const allowedUsers = process.env.ALLOWED_USERS.split(",");

    if (!allowedUsers.includes(message.author.id)) {
      return message.channel.send(
        "sorry you have no perms to use this command only my creator KFL, and the people who have been given access can use this command"
      );
    }

    waitingConfirm = true;

    message.channel.send("Confirm export? type ¿yes");
  }
};
