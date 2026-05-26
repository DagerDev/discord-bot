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

  const lines = text.split("\n");

  const numbered = lines.map(
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

  return pages;
}

module.exports = {
  name: "tree",
  description: "Shows repository tree",

  async execute(message) {

    try {

      const res = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/git/trees/main?recursive=1`,
        {
          headers: headers()
        }
      );

      const tree =
        res.data.tree || [];

      if (!tree.length) {

        return message.channel.send(
          "Repository tree is empty."
        );

      }

      let output =
        "REPOSITORY TREE\n\n";

      tree.forEach(item => {

        const type =
          item.type === "tree"
            ? "[DIR]"
            : "[FILE]";

        output +=
          `${type} ${item.path}\n`;

      });

      const pages =
        createPages(output);

      message.client.views.set(
        message.author.id,
        {
          pages,
          page: 0
        }
      );

      return message.channel.send(
        "```txt\n" +
        `PAGE: 1/${pages.length}\n\n` +
        pages[0] +
        "\n```"
      );

    } catch (err) {

      console.error(
        err.response?.data || err
      );

      return message.channel.send(
        "Failed to fetch repository tree."
      );

    }

  }
};