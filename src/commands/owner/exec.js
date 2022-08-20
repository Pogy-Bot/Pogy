const Command = require("../../structures/Command");
const { exec } = require("child_process");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "exec",
      aliases: ["execute"],
      description: "This is for the developers.",
      category: "Owner",
      usage: ["<thing-to-exec>"],
      ownerOnly: true,
    });
  }

  async run(message, args) {
    if (message.content.includes("config.json"))
      return message.channel.sendCustom(
        "Due to privacy reasons, we can't show the config.json file."
      );

    if (args.length < 1)
      return message.channel.sendCustom(
        "You have to give me some text to execute!"
      );

    exec(args.join(" "), (error, stdout) => {
      const response = stdout || error;
      message.channel.sendCustom(response);
    });
  }
};
