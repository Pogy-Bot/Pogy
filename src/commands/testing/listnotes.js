const Command = require("../../structures/Command");
const NotesModel = require("../../database/models/notes.js"); // Renamed to avoid conflict
const { user } = require("tiktok-scraper");
const { MessageEmbed } = require("discord.js");

module.exports = class ListNotesCommand extends Command {
 constructor(...args) {
    super(...args, {
      name: "listnotes",
      aliases: [],
      description: "Lists all notes for a specific user.",
      category: "General",
      cooldown: 5,
    });
 }

 async run(message, interaction) {
    try {
      // Retrieve the user ID from the interaction options
      const targetUserId = message.mentions.users.first()?.id || message.author.id;

      if (!targetUserId) {
        return message.channel.send("Please provide a user to list notes for.");
      }

      // Query for notes specifically for that user
      const userNotes = await NotesModel.find({ userID: targetUserId });

      if (userNotes.length === 0) {
        return message.channel.send("No notes found for that user.");
      }

      // log only the contennt and userid 
      const userNotes2 = userNotes.map((note) => note.content).join("\n");
      // make embed ofc lol
      const embed = new MessageEmbed()
      .setTimestamp(

      )
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setColor("#FF5733")
      .setDescription(`Notes for <@${targetUserId}>:\n\n${userNotes2}`);
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error in the listnotes command:", error);
    }
 }
};