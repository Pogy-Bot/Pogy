const { Client, Collection } = require("discord.js"); // discord.js required for main functions
const Util = require("./src/structures/Util"); // Needed for utils, do not remove this important file or part of code.
const config = require("./config.json"); // config.json, create new file called this with template code or rename the file
const { status } = config; // used for activities to be shown

module.exports = class PogyClient extends Client {
  constructor(options = {}) {
    super({
      partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"], // partials for client, DO NOT EDIT.
      intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_VOICE_STATES",
        "GUILD_PRESENCES",
      ], // intents required for client, DO NOT EDIT THESE.
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: true,
      },
      presence: {
        status: "online", // can be "online", "dnd", "idle"
        activities: [
          {
            type: "WATCHING", // can be "WATCHING", "STREAMING" (url required for stream status), "PLAYING", or "LISTENING"
            name: status, // must be a string
          },
        ],
      },
    });
    // main bot code, DO NOT EDIT.
    this.validate(options);
    this.botCommands = new Collection();
    this.botEvents = new Collection();
    this.aliases = new Collection();
    this.utils = require("./src/utils/utils.js");
    this.mongoose = require("./src/utils/mongoose");
    this.utils = new Util(this);
    this.config = require("./config.json");
  }

  validate(options) {
    if (typeof options !== "object")
      throw new TypeError("Options should be a type of Object.");

    if (!options.prefix)
      throw new Error("You must pass a prefix for the client.");
    if (typeof options.prefix !== "string")
      throw new TypeError("Prefix should be a type of String.");
    this.prefix = options.prefix;
  }

  async start(token) {
    require("./src/utils/prototypes");
    await this.utils.loadCommands();
    await this.utils.loadEvents();
    await this.mongoose.init();
    this.login(token);
  }
};
