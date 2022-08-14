require("dotenv").config();
const PogyClient = require("./Pogy");
const config = require("./config.json");
const domain = require("./config.js");

const Pogy = new PogyClient(config);

const color = require("./src/data/colors");
Pogy.color = color;

Pogy.domain = domain.domain || `https://pogy.xyz`;

const emoji = require("./src/data/emoji");
Pogy.emoji = emoji;

let client = Pogy;
const jointocreate = require("./src/structures/jointocreate");
jointocreate(client);

Pogy.react = new Map();
Pogy.fetchforguild = new Map();

Pogy.start(process.env.TOKEN)

