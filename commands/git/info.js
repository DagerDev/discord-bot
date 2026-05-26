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
  name: "info",
  description: "Shows repo summary and latest commit",

  async execute(message) {
    if (!username || !repo || !token) {
      return message.channel.send("Missing GitHub environment variables.");
    }

    try {
      // -------------------------
      // 1. Repo metadata
      // -------------------------
      const repoRes = await axios.get(
        `https://api.github.com/repos/${username}/${repo}`,
        { headers: headers() }
      );

      const repoData = repoRes.data;

      // -------------------------
      // 2. Latest commit
      // -------------------------
      const commitRes = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/commits?per_page=1`,
        { headers: headers() }
      );

      const latest = commitRes.data[0];

      const sha = latest.sha.slice(0, 7);
      const messageText = latest.commit.message;
      const author = latest.commit.author.name;
      const date = latest.commit.committer.date;

      // -------------------------
      // Build output
      // -------------------------
      let output = "REPOSITORY INFO\n\n";

      output += "=== REPO SUMMARY ===\n";
      output += `Name: ${repoData.name}\n`;
      output += `Owner: ${repoData.owner.login}\n`;
      output += `Stars: ${repoData.stargazers_count}\n`;
      output += `Forks: ${repoData.forks_count}\n`;
      output += `Open Issues: ${repoData.open_issues_count}\n`;
      output += `Language: ${repoData.language || "Unknown"}\n`;
      output += `Visibility: ${repoData.private ? "Private" : "Public"}\n\n`;

      output += "=== LATEST COMMIT ===\n";
      output += `Hash: ${sha}\n`;
      output += `Author: ${author}\n`;
      output += `Date: ${date}\n`;
      output += `Message: ${messageText}\n`;

      return message.channel.send("```\n" + output + "\n```");

    } catch (err) {
      console.error(err);
      return message.channel.send("Failed to fetch repository info.");
    }
  }
};