const {
  renderPage
} = require("@utils/fileView")

const {
  getView,
  setView
} = require("@utils/github")

module.exports = {
  name: "prev",

  async execute(message) {

    const view =
      getView(
        message.client,
        message.author.id
      );

    if (!view) {

      return message.channel.send(
        "No active viewer session."
      );

    }

    if (view.page > 0) {

      view.page--;

    }

    setView(
      message.client,
      message.author.id,
      view
    );

    await renderPage(
      message,
      view
    );

  }
};