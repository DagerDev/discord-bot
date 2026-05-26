module.exports = {
  name: "go",
  description: "Go to a specific page",

  async execute(message, args) {

    const view =
      message.client.views.get(
        message.author.id
      );

    if (!view) {

      return message.channel.send(
        "No active viewer session."
      );

    }

    if (!args.length) {

      return message.channel.send(
        "Usage: !go <page>"
      );

    }

    const page =
      parseInt(args[0]) - 1;

    if (isNaN(page)) {

      return message.channel.send(
        "Invalid page number."
      );

    }

    if (
      page < 0 ||
      page >= view.pages.length
    ) {

      return message.channel.send(
        `Page must be between 1 and ${view.pages.length}`
      );

    }

    view.page = page;

    return message.channel.send(
      "```txt\n" +
      `PAGE: ${view.page + 1}/${view.pages.length}\n\n` +
      view.pages[view.page] +
      "\n```"
    );

  }
};