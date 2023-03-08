const fs = require("node:fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId } = require("../config.json")
const { green } = require("colors");


const commands = [];
const commandFolders = fs.readdirSync("./src/slashCommands");

for(const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./src/slashCommands/${folder}`).filter((file) => file.endsWith(".js"));

  for(const file of commandFiles) {
    const command = require(`./slashCommands/${folder}/${file}`);
    commands.push(command.data.toJSON());
  }
}


const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(clientId), { body: commands })
.then(() => console.log('Successfully registered application commands.'))
.catch(console.error);