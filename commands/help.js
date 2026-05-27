module.exports = {
  name: "help",
  category: "basic",
  description: "Shows command list",

  async execute(message, args) {

    const topic =
      args[0]?.toLowerCase();

    if (topic === "git") {

      const lines = [
        "GIT COMMANDS",
        "",
        "!git tree",
        "!git search <text>",
        "!git open <file>",
        "!git get",
        "!git info",
        "",
        "VIEWER",
        "",
        "!select <line>",
        "!line <line>",
        "!high <line>",
        "!find <text>",
        "",
        "IMAGE",
        "",
        "!img <file>"
      ];

      return message.channel.send(
        "```txt\n" +
        lines.join("\n") +
        "\n```"
      );

    }

    if (topic === "writer") {

      const lines = [
        "WRITER COMMANDS",
        "",
        "!w up",
        "Upload story.gd",
        "",
        "!w play",
        "Start story test mode",
        "",
        "!w play <scene>",
        "Start from scene",
        "",
        "!w c <number>",
        "Choose option",
        "",
        "!w q",
        "Quit play session",
        "",
        "!w push",
        "Commit and push story.gd"
      ];

      return message.channel.send(
        "```txt\n" +
        lines.join("\n") +
        "\n```"
      );

    }

    const lines = [
      "BASIC COMMANDS",
      "",
      "!export",
      "!find",
      "!haccess",
      "!help",
      "!img",
      "!info",
      "!ping",
      "!play",
      "",
      "TOPICS",
      "",
      "!help git",
      "!help writer"
    ];

    await message.channel.send(
      "```txt\n" +
      lines.join("\n") +
      "\n```"
    );

  }
};