const Command = require("../../structures/Command");
const {MessageEmbed} = require('discord.js');
module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "img",
      aliases: [],
      description: "Empty command template.",
      category: "General",
      cooldown: 5,
    });
  }

  async run(message) {
    const { Prodia } = require("prodia.js");
    const prodia = new Prodia("e53c8afb-bf1e-4ca7-a760-ba1fa4083ddd"); // API KEY HERE
    
    (async () => {
      const input2 = message.content.split(" ")[0];
      const cfg_scale2 = message.content.split("")[1];
      const steps2 = message.content.split("")[2];
      const generate = await prodia.generateImage({
        prompt: input2,
        model: "absolutereality_v181.safetensors [3d9d4d2b]",
        negative_prompt: "BadDream, (UnrealisticDream:1.3)",
        sampler: "DPM++ SDE Karras",
        cfg_scale: cfg_scale2[1],
        steps: steps2[2],
        aspect_ratio: "landscape",
      });

      while (generate.status !== "succeeded" && generate.status !== "failed") {
        new Promise((resolve) => setTimeout(resolve, 250));

        const job = await prodia.getJob(generate.job);
        if (job.status === "succeeded") {
        const embed = new MessageEmbed()
        .setAuthor("Requested by " + message.author.username)
        .setTitle("Image")
        .setImage(job.imageUrl)
        .setColor("#FF5733")

        .setFooter("job id: " + job.job)
        message.channel.send({ embeds: [embed] });
        break;
        }
      }
    })();
  }
  catch(error) {
    console.error("Error in the empty command:", error);
    message.channel.send("An error occurred. Please try again later.");
  }
};
