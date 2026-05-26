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

module.exports = {
  name: "search",

  async execute(message, args) {
    const keyword = args.join(" ").toLowerCase();

    if (!keyword) {
      return message.channel.send("Usage: !search <keyword>");
    }

    try {
      // Get repo tree (recursive file list)
      const res = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/git/trees/main?recursive=1`,
        { headers: headers() }
      );

      const tree = res.data.tree || [];

      const matches = tree
        .filter(item =>
          item.path.toLowerCase().includes(keyword)
        )
        .slice(0, 15);

      if (matches.length === 0) {
        return message.channel.send("No matches found.");
      }

      let output = `SEARCH RESULTS: "${keyword}"\n\n`;

      for (const item of matches) {
        output += `${item.type.toUpperCase()} ${item.path}\n`;
      }

      if (output.length > 1900) {
        output = output.slice(0, 1900) + "\n...";
      }

      message.channel.send("```\n" + output + "\n```");

    } catch (err) {
      console.error(err);
      message.channel.send("Search failed.");
    }
  }
};