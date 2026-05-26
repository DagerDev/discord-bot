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
  name: "collaborators",
  description: "Shows repo collaborators and active contributors",

  async execute(message) {
    if (!username || !repo || !token) {
      return message.channel.send("Missing GitHub environment variables.");
    }

    try {
      // 1. Get collaborators (requires token with permission)
      const collabRes = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/collaborators`,
        { headers: headers() }
      );

      const collaborators = collabRes.data || [];

      // 2. Get contributors (most active users)
      const contribRes = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/contributors`,
        { headers: headers() }
      );

      const contributors = contribRes.data || [];

      let output = "REPOSITORY COLLABORATORS\n\n";

      // ---------------------------
      // Collaborators list
      // ---------------------------
      output += "COLLABORATORS:\n";

      if (collaborators.length === 0) {
        output += "No collaborators found or no permission.\n";
      } else {
        for (const c of collaborators) {
          output += `- ${c.login} (${c.permissions?.admin ? "admin" : "collaborator"})\n`;
        }
      }

      output += "\nMOST ACTIVE CONTRIBUTORS:\n";

      // ---------------------------
      // Most active users
      // ---------------------------
      if (contributors.length === 0) {
        output += "No contributor data available.\n";
      } else {
        const top = contributors.slice(0, 5);

        for (const c of top) {
          output += `- ${c.login}: ${c.contributions} commits\n`;
        }
      }

      return message.channel.send("```\n" + output + "\n```");

    } catch (err) {
      console.error(err);

      return message.channel.send(
        "Failed to fetch collaborators (check token permissions)."
      );
    }
  }
};