// commands/git/tree.js

const { getTree } = require("@utils/github");
const { setView } = require("@utils/session");
const { renderPage } = require("@utils/fileView");

module.exports = {
  name: "tree",

  async execute(message) {

    const tree = await getTree();

    const lines = tree.map((x, i) => ({
      num: i + 1,
      text: `[${x.type}] ${x.path}`
    }));

    const view = {
      file: "TREE",
      rawLines: lines,
      page: 0,
      selected: null,
      selectedLine: null
    };

    setView(message.client, message.author.id, view);

    return renderPage(message, view);
  }
};