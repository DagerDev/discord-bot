module.exports = {
  name: "high",

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
        "Usage: !high <number>"
      );

    }

    const target =
      parseInt(args[0]);

    if (isNaN(target)) {

      return message.channel.send(
        "Invalid line number."
      );

    }

    if (
      target < 1 ||
      target > view.rawLines.length
    ) {

      return message.channel.send(
        "Line does not exist."
      );

    }

    view.highlight = target;

    return message.channel.send(
      `Highlighted line ${target}`
    );

  }
};