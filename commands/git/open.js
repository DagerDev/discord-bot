// commands/git/open.js

const { getFile } = require("@utils/github");
const { getView, setView } = require("@utils/session");
const { renderPage } = require("@utils/fileView");

module.exports = {
  name: "open",

  async execute(message, args) {

    const view = getView(message.client, message.author.id);

    if (!view) {
      return message.channel.send("No session.");
    }

    const file = args.join(" ").trim() || view?.selected?.data;

    if (!file) {
      return message.channel.send("No file.");
    }

    const content = await getFile(file);

    const lines = content.split("\n").map((t, i) => ({
      num: i + 1,
      text: t
    }));

    const newView = {
      file,
      rawLines: lines,
      page: 0,
      selectedLine: null,
      selected: null
    };

    setView(message.client, message.author.id, newView);

    return renderPage(message, newView);
  }
};