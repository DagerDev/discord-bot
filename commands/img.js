const { getView } = require("@utils/session")

const owner = process.env.GITHUB_USERNAME;
const repo = process.env.GITHUB_REPO;

module.exports = {
  name: "img",

  async execute(message, args) {

    const view = getView(message.client, message.author.id);

    let file = args.join(" ").trim();

    if (!file && view?.selected?.data) {
      file = view.selected.data;
    }

    if (!file) {
      return message.channel.send("No image selected.");
    }

    const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${file}`;

    return message.channel.send({
      content: `📷 ${file}`,
      files: [url]
    });

  }
};