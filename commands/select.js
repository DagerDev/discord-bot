// commands/git/select.js

const { getView, setView } = require("@utils/session");

module.exports = {
  name: "select",

  async execute(message, args) {

    const view = getView(message.client, message.author.id);

    if (!view) return message.channel.send("No session.");

    const line = parseInt(args[0]);

    const item = view.rawLines[line - 1];

    if (!item) return message.channel.send("Invalid line.");

    view.selected = item.text;

    setView(message.client, message.author.id, view);

    return message.channel.send(
`Selected: ${item.text}\nLine: ${line}`
    );
  }
};