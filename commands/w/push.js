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
    const targetDir = path.join(process.cwd(), "scripts");
    const target = path.join(targetDir, "story.gd");

    if (!fs.existsSync(source)) {
      return message.channel.send("story.gd not found.");
    }

    try {

      fs.mkdirSync(targetDir, { recursive: true });
      fs.copyFileSync(source, target);

      const git = simpleGit();

      // ensure repo is correct
      const remote = `https://${token}@github.com/${owner}/${repo}.git`;

      await git.add("./*");

      await git.commit("story update");

      await git.push(remote, "main");

      return message.channel.send(
        "```txt\nPushed to GitHub successfully\n```"
      );

    } catch (err) {

      console.log(err);

      return message.channel.send(
        "Push failed."
      );
    }
  }
};