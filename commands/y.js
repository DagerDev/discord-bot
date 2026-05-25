const axios = require("axios");

module.exports = {
  name: "y",

  async execute(message, args) {

    const allowedUsers = process.env.ALLOWED_USERS.split(",");

    if (!allowedUsers.includes(message.author.id)) return;

    await message.channel.send("Starting export...");

    try {

      // trigger workflow
      await axios.post(
        `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/actions/workflows/${process.env.WORKFLOW_FILE}/dispatches`,
        { ref: "main" },
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json"
          }
        }
      );

      await message.channel.send("Export started.");

      // wait 30 seconds
      await new Promise(resolve => setTimeout(resolve, 30000));

      // check latest workflow runs
      const runs = await axios.get(
        `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/actions/runs`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json"
          }
        }
      );

      const latestRun = runs.data.workflow_runs[0];

      if (latestRun.conclusion === "success") {

        await message.channel.send(
          `Deployment completed.\n${latestRun.html_url}`
        );

      } else if (latestRun.conclusion === "failure") {

        await message.channel.send(
          `Deployment failed.\n${latestRun.html_url}`
        );

      } else {

        await message.channel.send(
          `Still running...\n${latestRun.html_url}`
        );

      }

    } catch (err) {

      console.log(err.response?.data || err.message);

      await message.channel.send("Export failed.");

    }
  }
};