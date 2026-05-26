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

function formatSize(bytes) {

  if (bytes >= 1024 * 1024) {
    return (
      (bytes / (1024 * 1024)).toFixed(2) +
      " MB"
    );
  }

  if (bytes >= 1024) {
    return (
      (bytes / 1024).toFixed(2) +
      " KB"
    );
  }

  return bytes + " B";
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
  name: "size",
  description: "Shows largest repository files",

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

      const files =
        tree
          .filter(item => item.type === "blob")
          .sort((a, b) => b.size - a.size)
          .slice(0, 50);

      const outputLines = [];

      outputLines.push(
        "LARGEST FILES"
      );

      outputLines.push("");

      files.forEach(file => {

        outputLines.push(
          `${formatSize(file.size)} | ${file.path}`
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
          mode: "size"
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
        "Failed to fetch repository sizes."
      );

    }

  }
};