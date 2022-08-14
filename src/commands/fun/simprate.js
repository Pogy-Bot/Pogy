const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const discord = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "simprate",
      aliases: ["howsimp"],
      description: "See how simp you are",
      category: "Fun",
      usage: "[user]",
      examples: ["howsimp @user"],
      cooldown: 3,
    });
  }

  async run(message) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    function randomInteger(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const target = message.mentions.users.last();
    const authorId = message.author.id;

    let amount = randomInteger(1, 100);

    let embedd = new discord.MessageEmbed()
      .setColor("GREEN")
      .setTitle(`${language.simpmachine}`)
      .setDescription(`${language.simpyouare} **${amount}%** simp`);

    if (target === authorId) {
      message.channel.sendCustom(embedd);
    }
    if (!target) return message.channel.sendCustom(embedd);
    let targett = target.username;
    let embed = new discord.MessageEmbed()
      .setColor("GREEN")
      .setTitle(`${language.simpmachine}`)
      .setDescription(`${targett} ${language.simpIs} **${amount}%** simp`);
    message.channel.sendCustom({ embeds: [embed] });
  }
};
