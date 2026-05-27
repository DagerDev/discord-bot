const fs = require("fs");
const path = require("path");

const commands = new Map();

const files = fs
  .readdirSync(
    path.join(__dirname, "w")
  )
  .filter(file => file.endsWith(".js"));

for (const file of files) {

  const command =
    require(`./w/${file}`);

  commands.set(
    command.name,
    command
  );
}

module.exports = {
  name: "w",
  category: "writer",
  description: "Writer system",

  async execute(message, args) {

    const hasRole =
      message.member.roles.cache.has(
        process.env.WRITER_ROLE
      );

    const isOwner =
      message.author.id ===
      process.env.OWNER_ID;

    if (!hasRole && !isOwner) {

      return message.channel.send(
        "Writer access required."
      );
    }

    const sub =
      args.shift()?.toLowerCase();

    if (!sub) {

      return message.channel.send(
        "```txt\n" +
        "WRITER COMMANDS\n\n" +
        "!w up\n" +
        "!w play\n" +
        "!w play <scene>\n" +
        "!w c <number>\n" +
        "!w q\n" +
        "!w push\n" +
        "```"
      );
    }

    const cmd =
      commands.get(sub);

    if (!cmd) {

      return message.channel.send(
        "Unknown writer command."
      );
    }

    try {

      return await cmd.execute(
        message,
        args
      );

    } catch (err) {

      console.log(err);

      return message.channel.send(
        "Writer command failed."
      );
    }
  }
};