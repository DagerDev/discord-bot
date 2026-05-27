const {
  clearSession
} = require("@utils/writerSession");

module.exports = {
  name: "q",

  async execute(message) {

    clearSession(
      message.author.id
    );

    return message.channel.send(
      "Play session ended."
    );
  }
};