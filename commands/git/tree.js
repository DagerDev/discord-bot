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
  name: "tree",
  description: "Shows repository file structure",

  async execute(message) {
    if (!username || !repo || !token) {
      return message.channel.send("Missing GitHub environment variables.");
    }

    try {
      // Fetch full repo tree (recursive)
      const res = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/git/trees/main?recursive=1`,
        { headers: headers() }
      );

      const tree = res.data.tree || [];

      if (tree.length === 0) {
        return message.channel.send("Repository is empty or cannot be read.");
      }

      let output = "REPOSITORY TREE (partial)\n\n";

      // Limit output to avoid Discord 2000 char limit
      const limited = tree.slice(0, 40);

      for (const item of limited) {
        const type = item.type === "tree" ? "[DIR]" : "[FILE]";
        output += `${type} ${item.path}\n`;
      }

      if (tree.length > 40) {
        output += `\n... +${tree.length - 40} more items`;
      }

      return message.channel.send("```\n" + output + "\n```");

    } catch (err) {
      console.error(err);
      return message.channel.send("Failed to fetch repository tree.");
    }
  }
};