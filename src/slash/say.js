module.exports = {
    name: "say",
    description: "Make the bot say something!",
    category: "general",
    slash: true,
    global: true,
    options: [
      {
        name: "message",
        description: "Enter the message you want the bot to say.",
        type: "STRING",
        required: true,
      },
    ],
    error: async (data, error) => {
      console.error(error);
      await data.interaction.reply({
        content: "There was an error while processing your command.",
        ephemeral: true,
      });
    },
    run: async (data) => {
      try {

        const userMessage = data.interaction.options.getString("message");
  
        await data.interaction.followUp({ content: userMessage });
      } catch (error) {
        console.error(error);
        
        await data.interaction.followUp({
          content: "Failed to execute the command.",
          ephemeral: true,
        });
      }
    },
  };
  