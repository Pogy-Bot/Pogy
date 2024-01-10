// Imports lol
require("dotenv").config();
const { MessageEmbed, MessageActionRow , MessageButton} = require('discord.js');
const PogyClient = require("./Pogy");
const config = require("./config.json");
const deploy = require("./src/deployCommands.js");
const path = require("node:path");
const { Collection } = require("discord.js");
const logger = require("./src/utils/logger");
const fs = require("node:fs");
const Pogy = new PogyClient(config);
const { Distube } = require('distube');
const { Player } = require('discord-player');
const color = require("./src/data/colors");
const buttonHandler = require('./src/handlers/button.js');
Pogy.color = color;

const emoji = require("./src/data/emoji");
Pogy.emoji = emoji;

let client = Pogy;
const jointocreate = require("./src/structures/jointocreate");
jointocreate(client);
// end imports

// Load user data from the JSON file
let userData = require('./src/data/users.json');

client.on('messageCreate', message => {
  if (message.author.bot) return;

  const userId = message.author.id; // Define userId here
  if (!userData.users[userId]) {
    userData.users[userId] = {
      xp: 0,
      level: 1,
      username: message.author.username // Save the username in the userData
    };
  }

  // If the background URL is not set, save it
  if (!userData.users[userId].background) {
    userData.users[userId].background = 'https://img.freepik.com/premium-photo/abstract-blue-black-gradient-plain-studio-background_570543-8893.jpg'; // Replace with your default background URL
  }

  const levelbed = new MessageEmbed()
    .setColor(color.blue)
    .setTitle('Level Up!')
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`You have reached level ${userData.users[userId].level}!`)
    .setFooter(`XP: ${userData.users[userId].xp}/${userData.users[userId].level * 75}`)
    
  const row = new MessageActionRow().addComponents(

    new MessageButton()
      .setCustomId('levelup')
      .setLabel('Level Up')
      .setStyle('SUCCESS')

  )
  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'levelup') { // Assuming this is the correct customId
        await interaction.reply('Button clicked!');
    }
});

const moreinfo = new MessageEmbed()
  .setColor(color.blue)
  .setTitle('More Info')
  .setURL("https://pogy.xyz/invite")
  .setThumbnail(message.client.user.displayAvatarURL())
  .setDescription("Pogy is a music bot with a lot of features. You can invite Pogy to your server by clicking the button below")
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  try {
      if (interaction.customId === 'support') {
          await interaction.reply({ embeds: [moreinfo] });
      } else if (interaction.customId === 'button2') {
          // Perform different actions for button 2

          /// this isnt done yet just commiting
      } else {
          await interaction.reply('Unknown button clicked.');
      }
  } catch (error) {
      console.error('Error handling button interaction:', error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
  }
});


  // Increment XP for the user
  userData.users[userId].xp += 1;

  // Check for level-up logic
  const xpNeededForNextLevel = userData.users[userId].level * 75;
  if (userData.users[userId].xp >= xpNeededForNextLevel) {
    userData.users[userId].level += 1;
    message.channel.send({embeds : [levelbed], components : [row]});
  }
 
  // Save updated data back to the JSON file
  fs.writeFile('./src/data/users.json', JSON.stringify(userData, null, 2), err => {
    if (err) console.error('Error writing file:', err);
  });
});

client.slashCommands = new Collection();
const commandsFolders = fs.readdirSync("./src/slashCommands");

for (const folder of commandsFolders) {
  const commandFiles = fs.readdirSync(`./src/slashCommands/${folder}`).filter((file) => file.endsWith(".js"));

  for(const file of commandFiles) {
    const slashCommand = require(`./src/slashCommands/${folder}/${file}`);
    client.slashCommands.set(slashCommand.data.name, slashCommand);
    Promise.resolve(slashCommand);
  }
}

client.on('interactionCreate', async interaction => {
  if(!interaction.isCommand()) return;

  const slashCommand = client.slashCommands.get(interaction.commandName);

  if (!slashCommand) return;

  try {
    await slashCommand.execute(interaction);
  } catch (error) {
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// mem leak fix
client.setMaxListeners(20);

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    buttonHandler.handleButton(interaction);
  }
});

Pogy.react = new Map();
Pogy.fetchforguild = new Map();

Pogy.start(process.env.TOKEN);

process.on("unhandledRejection", (reason, p) => {
  logger.info(`[unhandledRejection] ${reason.message}`, { label: "ERROR" });
  console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
  logger.info(`[uncaughtException] ${err.message}`, { label: "ERROR" });
  console.log(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  logger.info(`[uncaughtExceptionMonitor] ${err.message}`, { label: "ERROR" });
  console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  logger.info(`[multipleResolves] MULTIPLE RESOLVES`, { label: "ERROR" });
  console.log(type, promise, reason);
});