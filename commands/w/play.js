const fs = require("fs");
const { extractNodes } =
  require("@utils/storyParser");

const {
  setSession
} = require("@utils/writerSession");

module.exports = {
  name: "play",

  async execute(message, args) {

    if (!fs.existsSync("story.gd")) {
      return message.channel.send(
        "Upload story.gd first."
      );
    }

    const raw =
      fs.readFileSync(
        "story.gd",
        "utf8"
      );

    const nodes =
      extractNodes(raw);

    if (!nodes) {
      return message.channel.send(
        "Failed to parse story."
      );
    }

    const start =
      args[0] || "start";

    if (!nodes[start]) {
      return message.channel.send(
        "Scene not found."
      );
    }

    const session = {
      nodes,
      current: start
    };

    setSession(
      message.author.id,
      session
    );

    return renderNode(
      message,
      session
    );
  }
};

function renderNode(
  message,
  session
) {

  const node =
    session.nodes[
      session.current
    ];

  let text =
`${node.text}\n\n`;

  node.choices.forEach(
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