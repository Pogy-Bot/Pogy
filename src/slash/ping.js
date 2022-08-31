module.exports = {
  name: "ping",
  description: "Get the bot's api ping!",
  category: "general",
  slash: "true",
  global: true,
  error: async () => {},
  run: async (data) => {
    data.interaction.editReply({
      content: `Api Ping: \`${Math.floor(
        data.interaction.client.ws.ping
      )} ms\``,
    });
  },
};
