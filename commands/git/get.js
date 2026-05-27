const { getFile } = require("@utils/github");
const { getView } = require("@utils/session");

module.exports = {
  name: "get",

  async execute(message) {

    const view = getView(message.client, message.author.id);

    let file = view?.selected?.data;

    if (!file) {
      return message.channel.send("No selected file.");
    }

    const content = await getFile(file);

    if (content.length > 1900) {
      return message.channel.send("File too large.");
    }

    return message.channel.send("```txt\n" + content + "\n```");

  }
};