const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

module.exports = {
  name: "ask",

  async execute(message, args) {
    const prompt = args.join(" ");

    if (!prompt) {
      return message.reply("Usage: !ask <question>");
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash"
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return message.reply(text.substring(0, 1900));

    } catch (error) {
      return message.reply(
        "❌ AI Error:\n```json\n" +
        JSON.stringify(
          {
            message: error.message,
            status: error.status
          },
          null,
          2
        ).slice(0, 1800) +
        "\n```"
      );
    }
  }
};