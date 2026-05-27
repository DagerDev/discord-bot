const { getView, setView } = require("@utils/session");
const { renderPage } = require("@utils/fileView");

module.exports = {
  name: "find",

  async execute(message, args) {

    const view = getView(message.client, message.author.id);

    if (!view) {
      return message.channel.send("No active session.");
    }

    const query = args.join(" ").toLowerCase().trim();

    if (!query) {
      return message.channel.send("Usage: !find <text>");
    }

    const index = view.rawLines.findIndex(lineObj =>
      lineObj.text.toLowerCase().includes(query)
    );

    if (index === -1) {
      return message.channel.send("Not found.");
    }

    const lineNumber = index + 1;

    view.page = Math.floor(index / 20);
    view.selectedLine = lineNumber;

    setView(message.client, message.author.id, view);

    await renderPage(message, view);

    return message.channel.send(
      "```txt\n" +
      "FOUND MATCH\n\n" +
      `Line: ${lineNumber}\n` +
      `Text: ${view.rawLines[index].text}` +
      "\n```"
    );

  }
};