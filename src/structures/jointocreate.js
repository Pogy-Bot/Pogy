const Vc = require("../database/schemas/tempvc");
const jointocreatemap = new Map();
module.exports = function (client) {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (!oldState || !newState) return;

    const vcDB = await Vc.findOne({
      guildId: oldState.guild.id || newState.guild.id,
    });

    if (!vcDB) return;

    let voice = vcDB.channelId;

    let category = vcDB.categoryID;

    if (!voice || !category) return;

    if (!oldState.channelId && newState.channelId) {
      if (newState.channelId !== voice) return;
      jointocreatechannel(newState);
    }

    if (oldState.channelId && !newState.channelId) {
      if (
        jointocreatemap.get(
          `tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`
        )
      ) {
        var vc = oldState.guild.channels.cache.get(
          jointocreatemap.get(
            `tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`
          )
        );

        if (vc.members.size < 1) {
          jointocreatemap.delete(
            `tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`
          );

          return vc.delete().catch(() => {});
        }
      }
    }

    if (oldState.channelId && newState.channelId) {
      if (oldState.channelId !== newState.channelId) {
        if (newState.channelId === voice) jointocreatechannel(oldState);

        if (
          jointocreatemap.get(
            `tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`
          )
        ) {
          var vc2 = oldState.guild.channels.cache.get(
            jointocreatemap.get(
              `tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`
            )
          );

          if (vc2.members.size < 1) {
            jointocreatemap.delete(
              `tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`
            );

            return vc2.delete().catch(() => {});
          }
        }
      }
    }
  });
  async function jointocreatechannel(user) {
    try {
      const vcDB = await Vc.findOne({
        guildId: user.guild.id,
      });
      if (!vcDB) return;

      let category = vcDB.categoryID;
      if (!category) return;

      await user.guild.channels
        .create(`${user.member.user.username}'s Room`, {
          type: "GUILD_VOICE",
          parent: category,
        })
        .then(async (vc) => {
          user.setChannel(vc).catch(() => {});

          jointocreatemap.set(
            `tempvoicechannel_${vc.guild.id}_${vc.id}`,
            vc.id
          );

          await vc.permissionOverwrites.set([
            {
              id: user.id,
              allow: ["MANAGE_CHANNELS"],
            },
            {
              id: user.guild.id,
              allow: ["VIEW_CHANNEL"],
            },
          ]);
        });
    } catch (err) {
      let vcDB = await Vc.findOne({
        guildId: user.guild.id,
      });

      vcDB
        .updateOne({
          channelId: null,
          categoryID: null,
        })
        .catch((err) => console.error(err));
    }
  }
};
