const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "up",

  async execute(message) {

    const attachment =
      message.attachments.first();

    if (!attachment) {

      return message.channel.send(
        "Upload story.gd with !w up"
      );
    }

    const fileName =
      attachment.name;

    if (fileName !== "story.gd") {

      return message.channel.send(
        "Only story.gd allowed."
      );
    }

    const savePath =
      path.join(
        process.cwd(),
        "story.gd"
      );

    try {

      const response =
        await axios({
          url: attachment.url,
          method: "GET",
          responseType: "stream"
        });

      const writer =
        fs.createWriteStream(
          savePath
        );

      response.data.pipe(writer);

      writer.on(
        "finish",
        () => {

          return message.channel.send(
            "```txt\n" +
            "story.gd uploaded.\n\n" +
            "Use !w play" +
            "\n```"
          );

        }
      );

      writer.on(
        "error",
        () => {

          return message.channel.send(
            "Failed to save file."
          );

        }
      );

    } catch (err) {

      console.log(err);

      return message.channel.send(
        "Upload failed."
      );
    }
  }
};