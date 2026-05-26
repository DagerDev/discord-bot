module.exports = {
  name: "find",
  description: "Find text inside current viewer session",

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
        "Usage: !find <text>"
      );

    }

    const query =
      args.join(" ").toLowerCase();

    const matches = [];

    view.rawLines.forEach(line => {

      if (
        line.toLowerCase().includes(query)
      ) {

        matches.push(line);

      }

    });

    if (!matches.length) {

      return message.channel.send(
        "No matches found."
      );

    }

    const output =
      matches.join("\n");

    const pages = [];
    const split =
      output.split("\n");

    for (
      let i = 0;
      i < split.length;
      i += 25
    ) {

      pages.push(
        split
          .slice(i, i + 25)
          .join("\n")
      );

    }

    message.client.views.set(
      message.author.id,
      {
        pages,
        page: 0,
        rawLines: matches,
        mode: "find"
      }
    );

    return message.channel.send(
      "```txt\n" +
      pages[0] +
      "\n```"
    );

  }
};