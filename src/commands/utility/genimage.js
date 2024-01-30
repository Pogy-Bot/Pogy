const Command = require("../../structures/Command");
const { Prodia } = require('prodia.js');

const prodia = new Prodia('e53c8afb-bf1e-4ca7-a760-ba1fa4083ddd'); // Replace with your Prodia API key

module.exports = class GenerateArtCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "generateart",
      description: "Generate art using the Prodia API.",
      category: "Art",
      cooldown: 5,
      usage: "<prompt>",
      args: true,
    });
  }

  async run(message, args) {
    try {
      const prompt = args.join(" "); // Join the arguments to form the prompt
      const generate = await prodia.generateImage({
        prompt,
        model: "absolutereality_v181.safetensors [3d9d4d2b]",
        negative_prompt: "BadDream, (UnrealisticDream:1.3)",
        sampler: "DPM++ SDE Karras",
        cfg_scale: 9,
        steps: 30,
        aspect_ratio: "portrait"
      });

      while (generate.status !== "succeeded" && generate.status !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 250));
        const job = await prodia.getJob(generate.job);

        if (job.status === "succeeded") {
          const imageUrl = job.result.output.url;
          message.reply({ content: `Art generated! ${imageUrl}` });
          break;
        }
      }
    } catch (error) {
      console.error('Error generating art:', error.message);
      message.reply('Failed to generate art. Please try again later.');
    }
  }
};
