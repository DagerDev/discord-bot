const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

module.exports = {
  name: "ask",

  async execute(message, args) {
    const prompt = args.join(" ");

    if (!prompt) {
      return message.reply("Usage: !ask <question>");
    }

    if (!process.env.GEMINI_KEY) {
      return message.reply("❌ Missing GEMINI_KEY");
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (!text) {
        return message.reply("❌ No response from AI");
      }

      return message.reply(text.substring(0, 1900));

    } catch (error) {
      // FULL DEBUG LOG (terminal)
      console.error("FULL AI ERROR:", error);

      // SAFE full error for Discord (trimmed)
      const fullError = JSON.stringify(
        {
          name: error?.name,
          message: error?.message,
          status: error?.status,
          stack: error?.stack
        },
        null,
        2
      );

      return message.reply(
        "❌ AI ERROR (FULL DEBUG)\n```json\n" +
        fullError.slice(0, 1800) +
        "\n```"
      );
    }
  }
};