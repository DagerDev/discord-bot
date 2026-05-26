const axios = require("axios");

module.exports = {

  name: "update",

  async execute(message) {

    try {

      await axios.post(

        `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/discord-bot/dispatches`,

        {
          event_type: "discord-update"
        },

        {
          headers: {
            Authorization:
              `token ${process.env.GITHUB_TOKEN}`,

            Accept:
              "application/vnd.github+json"
          }
        }

      );

      message.reply(
        "🚀 Deploy triggered."
      );

    } catch (error) {

      console.error(error);

      message.reply(
        "❌ Deploy failed."
      );

    }

  }

};