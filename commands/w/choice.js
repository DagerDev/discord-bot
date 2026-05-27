const {
  getSession
} = require("@utils/writerSession");

module.exports = {
  name: "c",

  async execute(message, args) {

    const session =
      getSession(
        message.author.id
      );

    if (!session) {
      return message.channel.send(
        "No active play session."
      );
    }

    const node =
      session.nodes[
        session.current
      ];

    const num =
      parseInt(args[0]);

    if (
      isNaN(num) ||
      !node.choices[num - 1]
    ) {
      return message.channel.send(
        "Invalid choice."
      );
    }

    session.current =
      node.choices[num - 1].next;

    const next =
      session.nodes[
        session.current
      ];

    let text =
`${next.text}\n\n`;

    next.choices.forEach(
      (c, i) => {

        text +=
`${i + 1}. ${c.text}\n`;

      }
    );

    text += "\n!w c <number>";
    text += "\n!w q";

    return message.channel.send(
      "```txt\n" +
      text +
      "\n```"
    );
  }
};