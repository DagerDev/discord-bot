const fs = require("fs");
const axios = require("axios");

const owner = process.env.GITHUB_USERNAME;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;

module.exports = {
  name: "push",

  async execute(message) {

    try {

      if (!fs.existsSync("story.gd")) {
        return message.channel.send(
          "story.gd not found."
        );
      }

      const content =
        fs.readFileSync(
          "story.gd",
          "utf8"
        );

      const encoded =
        Buffer
          .from(content)
          .toString("base64");

      const path =
        "scripts/story.gd";

      let sha = null;

      // check if file exists
      try {

        const existing =
          await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
                "User-Agent":
                  "discord-bot"
              }
            }
          );

        sha = existing.data.sha;

      } catch {}

      // upload/update
      await axios.put(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          message: "story update",
          content: encoded,
          sha
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "User-Agent":
              "discord-bot"
          }
        }
      );

      return message.channel.send(
        "```txt\n" +
        "story.gd pushed to game-jamm/scripts/" +
        "\n```"
      );

    } catch (err) {

      console.log(
        err.response?.data || err
      );

      return message.channel.send(
        "Push failed."
      );
    }
  }
};