const axios = require("axios");
const sharp = require("sharp");

const username = process.env.GITHUB_USERNAME;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;

function headers() {
  return {
    Authorization: `Bearer ${token}`,
    "User-Agent": "discord-bot"
  };
}

const chars = " .:-=+*#%@";

function mapPixel(value) {
  const index =
    Math.floor((value / 255) * (chars.length - 1));
  return chars[index];
}

async function imageToAscii(buffer, width = 80) {

  const image =
    sharp(buffer)
      .resize(width)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

  const { data, info } = await image;

  const height = Math.floor(info.height);

  let output = "";

  for (let y = 0; y < height; y++) {

    let line = "";

    for (let x = 0; x < width; x++) {

      const pixel =
        data[y * width + x];

      line += mapPixel(pixel);

    }

    output += line + "\n";
  }

  return output;
}

function createPages(text, perPage = 20) {

  const lines = text.split("\n");

  const pages = [];

  for (let i = 0; i < lines.length; i += perPage) {

    pages.push(
      lines.slice(i, i + perPage).join("\n")
    );

  }

  return pages;
}

module.exports = {
  name: "open",

  async execute(message, args) {

    if (!args.length) {
      return message.channel.send(
        "Usage: !img open <file>"
      );
    }

    const filePath = args.join("/");

    try {

      const res = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`,
        { headers: headers() }
      );

      const buffer = Buffer.from(
        res.data.content,
        "base64"
      );

      const ascii =
        await imageToAscii(buffer, 80);

      const pages =
        createPages(ascii, 20);

      message.client.views.set(
        message.author.id,
        {
          pages,
          page: 0,
          rawLines: ascii.split("\n"),
          mode: "img"
        }
      );

      return message.channel.send(
        "```txt\n" +
        pages[0] +
        "\n```"
      );

    } catch (err) {

      console.error(err);

      return message.channel.send(
        "Failed to process image."
      );

    }

  }
};