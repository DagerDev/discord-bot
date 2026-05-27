const { getTree } = require("@utils/github");
const { setView } = require("@utils/session");
const { renderPage } = require("@utils/fileView");

module.exports = {
  name: "search",

  async execute(message, args) {

    const query = args.join(" ").toLowerCase().trim();

    if (!query) {
      return message.channel.send("Usage: !git search <text>");
    }

    const tree = await getTree();

    const matches = tree.filter(item =>
      item.path.toLowerCase().includes(query)
    );

    if (!matches.length) {
      return message.channel.send("No results.");
    }

    const lines = matches.map((item, i) => ({
      num: i + 1,
      text: `[${item.type}] ${item.path}`
    }));

    const view = {
      file: "SEARCH",
      rawLines: lines,
      page: 0,
      selected: null,
      selectedLine: null
    };

    setView(message.client, message.author.id, view);

    return renderPage(message, view);

  }
};