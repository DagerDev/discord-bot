const { getView } = require("@utils/session");
const { getTree } = require("@utils/github");

module.exports = {
  name: "info",

  async execute(message) {

    const view = getView(message.client, message.author.id);

    if (!view?.selected) {
      return message.channel.send("No selected file.");
    }

    const path = view.selected.data;

    const tree = await getTree();
    const item = tree.find(x => x.path === path);

    if (!item) {
      return message.channel.send("File not found in repo.");
    }

    const size = item.size ? `${(item.size / 1024).toFixed(1)} KB` : "Unknown";

    return message.channel.send(
````txt
FILE: ${item.path}
TYPE: ${item.type}
SIZE: ${size}
);
}};