const axios = require("axios");

module.exports = {

  name: "update",

  async execute(message) {

    try {

      await axios.post(

        `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/actions/workflows/${process.env.WORKFLOW_FILE}/dispatches`,

        {
          ref: "main"
        },

        {
          headers: {
            Authorization:
              `Bearer ${process.env.GITHUB_TOKEN}`,

            Accept:
              "application/vnd.github+json"
          }
        }

      );

      message.reply(
        "🚀 Deployment started."
      );

    } catch (error) {

      console.error(error);

      message.reply(
        "❌ Deployment failed."
      );

    }

  }

};