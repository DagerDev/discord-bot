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

function createPages(text, linesPerPage = 25) {
  const rawLines = text.split("\n");

  const numbered = rawLines.map(
    (line, i) => `${i + 1} | ${line}`
  );

  const pages = [];

  for (
    let i = 0;
    i < numbered.length;
    i += linesPerPage
  ) {
    pages.push(
      numbered
        .slice(i, i + linesPerPage)
        .join("\n")
    );
  }

  return {
    pages,
    rawLines: numbered
  };
}

module.exports = {
  name: "search",
  description: "Search files in repository",

  async execute(message, args) {

    if (!args.length) {
      return message.channel.send(
        "Usage: !git search <keyword>"
      );
    }

    const keyword =
      args.join(" ").toLowerCase();

    try {

      const res = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/git/trees/main?recursive=1`,
        {
          headers: headers()
        }
      );

      const tree =
        res.data.tree || [];

      const matches =
        tree.filter(item =>
          item.path
            .toLowerCase()
            .includes(keyword)
        );

      if (!matches.length) {
        return message.channel.send(
          "No matching files found."
        );
      }

      const outputLines = [];

      outputLines.push(
        `SEARCH RESULTS FOR "${keyword}"`
      );

      outputLines.push("");

      matches.forEach(item => {

        const type =
          item.type === "tree"
            ? "[DIR]"
            : "[FILE]";

        outputLines.push(
          `${type} ${item.path}`
        );

      });

      const text =
        outputLines.join("\n");

      const {
        pages,
        rawLines
      } = createPages(text);

      message.client.views.set(
        message.author.id,
        {
          pages,
          page: 0,
          rawLines,
          mode: "search"
        }
      );

      return message.channel.send(
        "```txt\n" +
        pages[0] +
        "\n```"
      );

    } catch (err) {

      console.error(
        err.response?.data || err
      );

      return message.channel.send(
        "Failed to search repository."
      );

    }

  }
};