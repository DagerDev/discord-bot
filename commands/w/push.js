const fs = require("fs");
const path = require("path");
const simpleGit = require("simple-git");

const owner = process.env.GITHUB_USERNAME;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;

module.exports = {
  name: "push",

  async execute(message) {

    const source = path.join(process.cwd(), "story.gd");

    if (!fs.existsSync(source)) {
      return message.channel.send("story.gd not found.");
    }

    try {

      const git = simpleGit();

      const remoteUrl =
        `https://${token}@github.com/${owner}/${repo}.git`;

      await git.add("./*");

      await git.commit("story update");

      await git.push("origin", "main", {
        "--repo": remoteUrl
      });

      return message.channel.send(
        "```txt\nPush successful\n```"
      );

    } catch (err) {

      console.log(err);

      return message.channel.send(
        "Push failed (check repo/token/branch)."
      );
    }
  }
};