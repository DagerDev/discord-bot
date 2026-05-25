const {
  GoogleGenerativeAI
} = require("@google/generative-ai");

const genAI =
  new GoogleGenerativeAI(process.env.GEMINI_KEY);

module.exports = {

  name: "ai",

  async execute(message, args) {

    const prompt = args.join(" ");

    if (!prompt) {
      return message.reply(
        "Usage: !ai <prompt>"
      );
    }

    try {

      const model =
        genAI.getGenerativeModel({
          model: "gemini-2.0-flash"
        });

      const result =
        await model.generateContent(
          `Reply short and simple.\n\n${prompt}`
        );

      const response =
        result.response.text();

      message.reply(response);

    } catch (error) {

      console.error(error);

      message.reply(
        "AI failed."
      );

    }

  }

};
