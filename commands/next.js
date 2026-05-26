module.exports = {
  name: "next",

  async execute(message) {

    const view =
      message.client.views.get(
        message.author.id
      );

    if (!view) {
      return message.channel.send(
        "No active viewer session."
      );
    }

    if (
      view.page >=
      view.pages.length - 1
    ) {
      return message.channel.send(
        "Already at bottom."
      );
    }

    view.page++;

    return message.channel.send(
      "```txt\n" +
      view.pages[view.page] +
      "\n```"
    );
  }
};