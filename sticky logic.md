client.on('messageCreate', async message => {
  if (message.author.bot) return;

  await setupSticky(message);

  // Your other messageCreate logic here...
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'addstickyvalues') {
      // Command to add or update values in the JSON file
      await addStickyValues(interaction);
  } else if (commandName === 'updatestickymessage') {
      // Command to update the content of the sticky message
      await updateStickyMessage(interaction);
  }
});

async function setupSticky(msg) {
  const guildId = msg.guild.id;

  // Create the stickyData directory if it doesn't exist
  const dataDir = './stickyData';
  if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
  }

  // Load or initialize the sticky messages from the JSON file
  const filePath = path.join(dataDir, `${guildId}.json`);
  let stickyData = {};

  if (fs.existsSync(filePath)) {
      stickyData = JSON.parse(fs.readFileSync(filePath));
  } else {
      fs.writeFileSync(filePath, JSON.stringify(stickyData));
  }

  // Check if the message is from the desired channel
  const stickyChannelId = stickyData.stickyChannelId || '1200072567055192075'; // Default channel ID
  const stickyMessageContent = stickyData.stickyMessageContent || 'This is a sticky message!';

  if (msg.channel.id === stickyChannelId) {
      // Get the current sticky message for this channel
      const currentStickyMessageId = stickyData.stickyMessageId;

      // If there's no sticky message yet, send one and store its ID
      if (!currentStickyMessageId) {
          const newStickyMessage = await msg.channel.send(stickyMessageContent);
          stickyData.stickyMessageId = newStickyMessage.id;
          saveStickyData(guildId, stickyData);
      } else {
          // If there's already a sticky message, delete it and send a new one
          const stickyMessage = await msg.channel.messages.fetch(currentStickyMessageId);
          if (stickyMessage) {
              await stickyMessage.delete();
          }
          const newStickyMessage = await msg.channel.send(stickyMessageContent);
          stickyData.stickyMessageId = newStickyMessage.id;
          saveStickyData(guildId, stickyData);
      }
  }
}

async function addStickyValues(interaction) {
  const guildId = interaction.guild.id;

  const stickyChannelId = interaction.options.getString('channelid');
  const stickyMessageContent = interaction.options.getString('messagecontent');

  // Load or initialize the sticky messages from the JSON file
  const filePath = path.join('./stickyData', `${guildId}.json`);
  let stickyData = {};

  if (fs.existsSync(filePath)) {
      stickyData = JSON.parse(fs.readFileSync(filePath));
  }

  // Add or update values in the JSON file
  stickyData.stickyChannelId = stickyChannelId;
  stickyData.stickyMessageContent = stickyMessageContent;
  saveStickyData(guildId, stickyData);

  await interaction.reply('Sticky values have been added or updated!');
}

async function updateStickyMessage(interaction) {
  const guildId = interaction.guild.id;

  // Load or initialize the sticky messages from the JSON file
  const filePath = path.join('./stickyData', `${guildId}.json`);
  let stickyData = {};

  if (fs.existsSync(filePath)) {
      stickyData = JSON.parse(fs.readFileSync(filePath));
  }

  const newStickyMessageContent = interaction.options.getString('newmessagecontent');

  // Check if there's a current sticky message ID
  const currentStickyMessageId = stickyData.stickyMessageId;
  if (currentStickyMessageId) {
      // Fetch the current sticky message and update its content
      const currentStickyMessage = await interaction.channel.messages.fetch(currentStickyMessageId);
      if (currentStickyMessage) {
          await currentStickyMessage.edit(newStickyMessageContent);
          stickyData.stickyMessageContent = newStickyMessageContent;
          saveStickyData(guildId, stickyData);
          await interaction.reply('Sticky message content has been updated!');
      } else {
          await interaction.reply('Error: Unable to fetch the current sticky message.');
      }
  } else {
      await interaction.reply('Error: No current sticky message found.');
  }
}

function saveStickyData(guildId, data) {
  const filePath = path.join('./stickyData', `${guildId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data));
}
