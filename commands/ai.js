const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const cooldowns = new Map();

module.exports = {
  name: "ai",

  async execute(message, args) {
    const prompt = args.join(" ");

    if (!prompt) {
      return message.reply("Usage: !ai <prompt>");
    }

    const userId = message.author.id;

    if (cooldowns.has(userId)) {
      return message.reply("⏳ Wait 30 seconds before using AI again.");
    }

    cooldowns.set(userId, true);
    setTimeout(() => cooldowns.delete(userId), 30000);

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      const result = await model.generateContent(
        `Reply in under 20 words.\n\n${prompt}`
      );

      const text = result.response.text();

      if (!text) {
        return message.reply("❌ Empty AI response");
      }

      return message.reply(text.substring(0, 1900));

    } catch (error) {
      // Normalize error info
      const status = error.status || "NO_STATUS";
      const msg = error.message || "No message";
      const name = error.name || "UnknownError";

      // Send readable error to Discord
      return message.reply(
        `❌ AI Error\n` +
        `• Type: ${name}\n` +
        `• Status: ${status}\n` +
        `• Message: ${msg.slice(0, 1500)}`
      );
    }
  }
};