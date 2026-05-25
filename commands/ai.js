const {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} = require("@qvac/sdk");

let modelId = null;
let loading = false;

async function getModel() {

  if (modelId) return modelId;

  if (loading) {

    while (loading) {
      await new Promise(r =>
        setTimeout(r, 1000)
      );
    }

    return modelId;

  }

  loading = true;

  modelId = await loadModel({

    modelSrc:
      LLAMA_3_2_1B_INST_Q4_0,

    modelType: "llm",

    onProgress: (progress) => {

      console.log(progress);

    }

  });

  loading = false;

  return modelId;

}

module.exports = {

  name: "ai",

  async execute(message, args) {

    const prompt =
      args.join(" ");

    if (!prompt) {

      return message.reply(
        "Usage: !ai <prompt>"
      );

    }

    try {

      const model =
        await getModel();

      const history = [
        {
          role: "user",
          content:
            `Reply short and simple.\n${prompt}`
        }
      ];

      const result =
        completion({
          modelId: model,
          history,
          stream: false
        });

      let text = "";

      for await (
        const token of result.tokenStream
      ) {

        text += token;

      }

      if (!text) {

        return message.reply(
          "No AI response."
        );

      }

      message.reply(
        text.substring(0, 1900)
      );

    } catch (error) {

      console.error(error);

      message.reply(
        "❌ Local AI failed."
      );

    }

  }

};