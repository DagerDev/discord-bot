const { getView, setView } = require("@utils/session")
const { renderPage } = require("@utils/fileView")

module.exports = {
  name: "line",

  async execute(message, args) {

    const view = getView(message.client, message.author.id);

    if (!view) {
      return message.channel.send("No active session.");
    }

    const line = parseInt(args[0]);

    if (isNaN(line)) {
      return message.channel.send("Usage: !line <number>");
    }

    if (!view.rawLines[line - 1]) {
      return message.channel.send("Invalid line.");
    }

    view.page = Math.floor((line - 1) / 20);
    view.selectedLine = line;

    setView(message.client, message.author.id, view);

    return renderPage(message, view);
  }
};