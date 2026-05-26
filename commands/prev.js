function renderPage(view) {

  const linesPerPage = 25;

  const start =
    view.page * linesPerPage;

  const end =
    start + linesPerPage;

  const lines =
    view.rawLines.slice(start, end);

  const output = [];

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {

    const actualLine =
      start + i + 1;

    let line = lines[i];

    if (
      view.highlight &&
      actualLine === view.highlight
    ) {

      line =
        `>>> ${line}`;

    }

    output.push(line);

  }

  return output.join("\n");

}

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
      renderPage(view) +
      "\n```"
    );

  }
};