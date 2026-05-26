module.exports = {
  name: "prev",

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

    if (view.page <= 0) {
      return message.channel.send(
        "Already at top."
      );
    }

    view.page--;

    return message.channel.send(
      "```txt\n" +
      view.pages[view.page] +
      "\n```"
    );
  }
};