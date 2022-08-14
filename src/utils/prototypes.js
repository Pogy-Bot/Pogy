const { MessageEmbed, TextChannel } = require("discord.js");

TextChannel.prototype.sendCustom = function (content) {
  try {
    if (typeof content === "object" && content instanceof MessageEmbed) {
      if (content.embed) {
        return this.send({ embeds: [content.embed] });
      } else {
        return this.send({ embeds: [content] });
      }
    } else {
      if (!(content instanceof MessageEmbed) && content.embed) {
        return this.send({ embeds: [content.embed] });
      }
    }
    if (typeof content === "string") {
      return this.send({ content });
    }
    return this.send(content);
  } catch (error) {
    console.log(error);
  }
};
