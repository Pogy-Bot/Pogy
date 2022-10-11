const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const darkrandom = require("random");
const darkemail = require("random-email");
const darkpassword = require("generate-password");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "hack",
            description: "Hack someone! (fake)",
            category: "Fun",
            usage: "<user>",
            examples: [ "hack @Pogy" ],
            botPermission: ["SEND_MESSAGES", "VIEW_CHANNEL", "SEND_MESSAGES"],
            cooldown: 5,
        });
    }

    async run(message) {
        const guildDB = await Guild.findOne({
            guildId: message.guild.id
        });

        const language = require(`../../data/language/${guildDB.language}.json`)

        const impostorpassword = darkpassword.generate({
            length: 10,
            numbers: true,
        });

        const user = message.mentions.users.first();
        if(!user) {
            return message.channel.sendCustom(`${language.hack1}`);
        } else {
            if (user.bot) {
                return message.channel.sendCustom(`${language.hackbot}`);
            }
        }
        const member = message.mentions.members.last();
        const mostCommon = [`${language.hack2}`, `${language.hack3}`, `${language.hack3}`, `${language.hack4}`, `${language.hack5}`, `${language.hack6}`];
        const lastdm = [
            `${language.hack7}`,
            `${language.hack8}`,
            `${language.hack9}`,
            `${language.hack10}`,
        ];


        const MessageResponses = [
            `[▘] ${language.hack13}`,
            `[▝] Email: \`${darkemail({ domain: "gmail.com" })}\`\nPassword: \`${impostorpassword}\``,
            `[▖] Last DM: "${lastdm[Math.floor(Math.random() * lastdm.length)]}"`,
            `[▘] ${language.hack14}`,
            `[▝] mostCommon = "${mostCommon[Math.floor(Math.random() * mostCommon.length)]}"`,
            `[▗] Finding IP address...`,
            `[▖] IP address: \`127.0.0.1:${darkrandom.int(100, 9999)}\``,
            `[▘] ${language.hack15}`,
            `[▝] ${language.hack16}`,
            `${language.hack17} ${member.user.username}`,
            `${language.hack18}`,
        ];

        let oldMessage = await message.reply({
            content: `${language.hack11} "${member.user.username}" ${language.hack12}`
        }).catch(err => { })

        if(oldMessage) {
            for(let i = 0; i > MessageResponses.length; i++) {
                setTimeout(async () => {
                    if(oldMessage?.editable) {
                        oldMessage = await oldMessage.edit({
                            content: `${MessageResponses[i]}`
                        }).catch(err => { })
                    }
                }, i * 1500)    
            };
        }
}}
