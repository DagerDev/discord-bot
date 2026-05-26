module.exports = {
  name: "line",

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
        "Usage: !line <number>"
      );
    }

    const line =
      parseInt(args[0]);

    if (isNaN(line)) {
      return message.channel.send(
        "Invalid line number."
      );
    }

    const target =
      view.rawLines[line - 1];

    if (!target) {
      return message.channel.send(
        "Line does not exist."
      );
    }

    // -------------------------
    // TREE / SEARCH MODE
    // -------------------------
    if (
      view.mode === "tree" ||
      view.mode === "search"
    ) {

      const clean =
        target.replace(
          /^\d+\s\|\s(\[FILE\]|\[DIR\])\s/,
          ""
        );

      return message.channel.send(
        `Use:\n!git open ${clean}`
      );

    }

    // -------------------------
    // OPEN MODE
    // -------------------------
    if (view.mode === "open") {

      return message.channel.send(
        "```js\n" +
        target +
        "\n```"
      );

    }

  }
};