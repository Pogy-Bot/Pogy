const Command = require("../../structures/Command.js");
const notes = require("../../database/models/notes.js"); // Assuming this connects to your MongoDB
const { MessageEmbed } = require("discord.js");

module.exports = class NoteCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "note",
      description: "Adds a note to the database.",
      category: "Utility",
      usage: "<note content>",
      cooldown: 5,
    });
  }

  async run(message, interaction) {
    try {
      const  noteContent = message.content.split(" ").slice(1).join(" ");
      // check if there is a dupelicate note there
      const existingnote = await notes.findOne({ userID: message.author.id, content: noteContent });
      if (existingnote) {
        return message.channel.send("You already have a note with that content!");
      }
      // if there is no duplicate note, create a new note
      if (!noteContent) {
        return message.channel.send("Please provide the note content.");
      }
      const newNote = new notes({
        userID: message.author.id,
        content: noteContent, 
        guildID: message.guild.id,
        // note to self : maybe adding more stuff later?
      });

      const embed = new MessageEmbed()
      .setTimestamp()
      .setColor("#FF5733")
      .setDescription("Note added successfully!\n\n Did you know you can check for your notes with the command \`<prefix>notes\`?")
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))

      await newNote.save();

      message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error("Error adding note:", error);
      message.channel.send("An error occurred while adding the note.");
    }
  }
};
