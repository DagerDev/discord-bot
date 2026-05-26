const axios = require("axios");

const username = process.env.GITHUB_USERNAME;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;

function headers() {
  return {
    Authorization: `Bearer ${token}`,
    "User-Agent": "discord-bot"
  };
}

function createPages(text, linesPerPage = 20) {

  const lines = text.split("\n");

  const numbered = lines.map(
    (line, i) => `${i + 1} | ${line}`
  );

  const pages = [];

  for (let i = 0; i < numbered.length; i += linesPerPage) {

    pages.push(
      numbered
        .slice(i, i + linesPerPage)
        .join("\n")
    );

  }

  return pages;
}

module.exports = {
  name: "open",
  description: "Open and read repository files",

  async execute(message, args) {

    if (!args.length) {

      return message.channel.send(
        "Usage: !git open <file>"
      );

    }

    const filePath = args.join("/");

    try {

      const res = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`,
        {
          headers: headers()
        }
      );

      if (!res.data.content) {

        return message.channel.send(
          "File content not found."
        );

      }

      const decoded =
        Buffer.from(
          res.data.content,
          "base64"
        ).toString("utf-8");

      const pages =
        createPages(decoded);

      message.client.views.set(
        message.author.id,
        {
          pages,
          page: 0
        }
      );

      return message.channel.send(
        "```js\n" +
        `FILE: ${filePath}\n` +
        `PAGE: 1/${pages.length}\n\n` +
        pages[0] +
        "\n```"
      );

    } catch (err) {

      console.error(
        err.response?.data || err
      );

      return message.channel.send(
        "Failed to open file."
      );

    }

  }
};