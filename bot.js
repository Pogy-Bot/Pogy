const { ClusterClient, getInfo } = require("discord-hybrid-sharding");
const Discord = require("discord.js");

const client = new Discord.Client({
  shards: getInfo().SHARD_LIST,
  shardCount: getInfo().TOTAL_SHARDS,
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_VOICE_STATES",
    "GUILD_PRESENCES",
  ],
});

client.cluster = new ClusterClient(client);
client.login(process.env.TOKEN);
