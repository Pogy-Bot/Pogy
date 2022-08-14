const Command = require("../../structures/Command");
const fetch = require("node-fetch");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "joke",
      description: "Generate a random joke from jokeAPI",
      category: "Fun",
    });
  }

  async run(message) {
    const data = await fetch(
      `https://sv443.net/jokeapi/v2/joke/Programming,Miscellaneous?blacklistFlags=nsfw,religious,political,racist,sexist`
    ).then((res) => res.json());

    if (!data)
      return message.channel.sendCustom(
        `Sorry, seems like i can't connect to JokeAPI.`
      );

    const { type, category, joke, setup, delivery } = data;

    message.channel.sendCustom({
      embed: {
        color: "BLURPLE",
        title: `${category} joke`,
        description: `${
          type === "twopart" ? `${setup}\n\n||${delivery}||` : joke
        }`,
      },
    });
  }
};
