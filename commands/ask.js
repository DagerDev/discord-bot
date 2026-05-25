const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// fallback model list (important fix)
const MODELS = [
  "gemini-pro",
  "gemini-1.0-pro",
  "gemini-1.5-pro"
];

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

    let lastError;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (text) {
          return message.reply(text.substring(0, 1900));
        }

      } catch (error) {
        lastError = error;
        console.log(`Model failed: ${modelName}`, error.message);
      }
    }

    // if all models fail → show full error
    return message.reply(
      "❌ AI FAILED (ALL MODELS)\n```json\n" +
      JSON.stringify(
        {
          message: lastError?.message,
          status: lastError?.status,
          name: lastError?.name
        },
        null,
        2
      ).slice(0, 1800) +
      "\n```"
    );
  }
};