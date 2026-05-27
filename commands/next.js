const {
  renderPage,
  getTotalPages
} = require("@utils/fileView")

const {
  getView,
  setView
} = require("@utils/session")

module.exports = {
  name: "next",

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

    const totalPages =
      getTotalPages(
        view.rawLines
      );

    if (
      view.page <
      totalPages - 1
    ) {

      view.page++;

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