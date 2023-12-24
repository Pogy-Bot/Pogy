module.exports = {
  name: "kick",
  description: "Kick a user from the server.",
  category: "moderation",
  slash: true,
  global: true, // Change to true if this is a global slash command
  usage: "/kick [user] [reason]",
  permissions: ["KICK_MEMBERS"], // Add required permissions here
  options: [
    {
      name: "user",
      description: "Select the user to kick.",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "Reason for the kick (optional)",
      type: "STRING",
      required: false,
    },
  ],

  run: async (data) => {
    try {
      // Check if the user has permission to use this command
      if (!data.member.permissions.has("KICK_MEMBERS")) {
        return await data.interaction.reply({
          content: "You don't have permission to use this command.",
          ephemeral: true,
        });
      }

      const user = data.options.getMember("user");
      const reason = data.options.getString("reason") || "No reason provided";

      // Check if a user was mentioned
      if (!user) {
        return await data.interaction.reply({
          content: "Please select a user to kick.",
          ephemeral: true,
        });
      }

      // Kick the mentioned user
      await user.kick(reason);

      // Check if the interaction is already replied or deferred
      if (data.interaction.deferred || data.interaction.replied) {
        console.log("Interaction has already been replied to.");
      } else {
        await data.interaction.reply({
          content: `Successfully kicked ${user.user.tag} for ${reason}.`,
        });
      }
    } catch (error) {
      console.error(error);
      await data.interaction.reply({
        content: "An error occurred while processing the command.",
        ephemeral: true,
      });
    }
  },
};
