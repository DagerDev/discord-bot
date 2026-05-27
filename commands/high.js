// commands/git/high.js

const { getView } = require("@utils/session")

module.exports = {
  name: "high",

  async execute(message, args) {

    const view = getView(message.client, message.author.id);
    if (!view) return message.channel.send("No session.");

    const nums = args.map(n => parseInt(n)).filter(Boolean).slice(0, 10);

    const out = nums.map(n => {
      const item = view.rawLines[n - 1];
      if (!item) return `${n} INVALID`;
      return `${n} | ${item.text}`;
    });

    return message.channel.send("```txt\n" + out.join("\n") + "\n```");
  }
};