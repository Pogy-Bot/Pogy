module.exports = {
  name: "help",
  description: "Display the bot commands!",
  category: "general",
  slash: "true",
  global: true,
  error: async () => {},
  run: async (data) => {
    data.interaction.editReply({
      content: `We are still working on our slash commands, come back later!!\n said peter 16 months ago`,
    });
  },
};
