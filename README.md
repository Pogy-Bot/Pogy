# the Discord Bot [DJS V13] 🤖
![Alt](https://repobeats.axiom.co/api/embed/452ab75762c584e2d600d1eae3586ba91a6da3b3.svg "Repobeats analytics image")
<p align="center">
  <br>
  <a href="https://github.com/peterhanania"><img src="https://dev.pogy.gg/favicon.ico"></a>
  <br>
  Pogy, a fully customizable bot built with 147 commands, 11 categories, and a dashboard using discord.js v13 🚀
  <br>
</p>

<h3 align=center>Explore the possibilities with Pogy! 🌐</h3>

[README-hindi.md](/README-hi-HI.md)
[README-polish](/README-pl-PL.md)

<div align=center>

 <a href="https://github.com/mongodb/mongo">
    <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?&style=for-the-badge&logo=mongodb&logoColor=white" alt="mongo">
  </a>
  
  <a href="https://github.com/discordjs">
    <img src="https://img.shields.io/badge/discord.js-v13.6.0-blue.svg?logo=npm" alt="discordjs">
  </a>

  <a href="https://github.com/peterhanania/Pogy/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-Apache%202-blue" alt="license">
  </a>

</div>

<p align="center">
  <a href="#about">About</a>
  •
  <a href="#features">Features</a>
  •
  <a href="#installation">Installation</a>
  •
  <a href="#setting-up">Setting Up</a>
  •
  <a href="#license">License</a>
  •
  <a href="#donate">Donate</a>
  •
  <a href="#credits">Credits</a>
</p>

## Community Updates 🌟
- [+ More dashboard pages and commands by Hotsuop](https://github.com/hotsu0p/Pogy)
- [+ Slash commands by eYuM](https://github.com/Pogy-Bot/Pogy/tree/eyum-contributions)

## Latest commit!
- ✨added commands lock and unlock
*[Changelog](https://394wkx-3000.csb.app/changelog)*

## Docs 📚
[Documentation](https://394wkx-3000.csb.app/docs)
*Note: Documentation is currently outdated and will be updated later.*

## About 🤔

Pogy is a Discord bot that was created exactly 2 years ago. The initial code was broken, prompting us to fix the bugs and transform it into a multipurpose discord.js v13 bot! You can click [this link](https://394wkx-3000.csb.app//invite) to invite the official bot! Additionally, you can join the official [Pogy's Support Server](https://394wkx-3000.csb.app//support) for assistance.

If you find this repository helpful, feel free to leave a star ⭐

## Features 🚀

- **147** commands and **11** different categories! 🎉
- **alt detector:** Blocks alts from the guild
- **applications:** Manage applications from the website
- **config:** Configure server settings
- **utility:** Some utility commands
- **economy:** Started but not done
- **fun:** A ton of commands to keep your server active
- **images:** Image Commands
- **information:** Information Commands
- **moderation:** Mod commands to moderate your discord server
- **reaction roles:** Reaction roles
- **tickets:** Guild tickets for support

Pogy also offers the following features on the website 🌐

- **Ticket Transcripts** + **Application Transcripts**
- **Contact & Report** page
- **Welcome messages** and **farewell messages** including embeds.
- Fully customizable **Logging** and **moderation**
- Fully customizable **Suggestions** and **Server Reports**
- A built-in **Premium system**
- A built-in maintenance mode
- A members Page
- Auto Mod, Leveling, and Commands ( not done )
- Built-in TOP.gg API

 <h1 align="center">
  <a href="https://github.com/peterhanania"><img src="https://i.imgur.com/On7mMNg.jpg["></a>
</h1>

**Webhooks: (for Developer)**
You can even log everything using webhooks directly from the config file!

<h1 align="center">
  <a href="https://github.com/peterhanania"><img src="https://i.imgur.com/vbGuLdL.jpg"></a>
</h1>

## Installation 🛠️

First clone the repo:

`git clone https://github.com/Pogy-Bot/Pogy.git`

Then run `npm i` or `npm install`

## Setting Up ⚙️

Your `config.json` should include:

- "developers": ID of Developers who can use the owner commands [ARRAY],
- "status": Your bot Status [STRING],
- "discord": Your bot's Support Server [STRING],
- "dashboard": If you want to enable the website dashboard ["true" / "false"] (STRING),
- "server": Your support server id [STRING],
- "prefix": Your default bot prefix [STRING],

Webhooks include:
- "logs": Webhook URL for command logs.
-  "maintenance_logs": Webhook URL for maintenance logs (if it gets triggered automatically),
-  "ratelimit_logs": Webhook URL for ratelimit logs,
- "blacklist": Webhook URL for blacklist logs,
-  "report": Webhook URL for report logs,
-  "contact": Webhook URL for contact logs,
-  "bugs": Webhook URL for bugs logs,
-  "premium": Webhook URL for premium logs,
-  "suggestions": Webhook URL for suggestions logs,
-  "votes": Webhook URL for votes logs,
-  "errors": Webhook URL for errors logs,
-  "auth": Webhook URL for auth logs,
-  "joinsPublic": Webhook URL to announce server joins in the support server,
-  "joinsPrivate": Webhook URL to announce server joins in your private server,
-  "leavesPublic": Webhook URL to announce server leaves in the support server,
-  "leavesPrivate": Webhook URL to announce server leaves in the private server,
-  "maintenance": Automatically enable maintenance mode if it gets rate limited ["true" / "false"] (STRING),
-  "maintenance_threshold": The amount of ratelimit triggers needed to enable maintenance mode [STRING] recommended [3-10]. Example "3",
-  "invite_link": Your bot's invite link,

SEO:
-  "enabled": if you want to enable SEO ["true" / "false"] (STRING),
-  "title": Your website's SEO title [STRING],
-  "description": Your website's SEO description [STRING],

Your `.env` file should include:

THE ONES NEEDED:
- TOKEN=YOUR BOT TOKEN
- MONGO=YOUR MONGO DATABASE URL
- SESSION_SECRET=A RANDOM STRING FOR SESSION SECURITY (Ex. 6B4E8&G#%Z&##bqcyEL5)
- AUTH_DOMAIN=Your Auth Domain (Ex. https://394wkx-3000.csb.app/ or http://localhost:3000) no slash at the end.
- MAIN_CLIENT_ID=the client id of your main application
- AUTH_CLIENT_ID=the client id of your auth application
- AUTH_CLIENT_SECRET= the client secret of your auth application
- PORT= the port of your website | default=3000

OPTIONAL:
- ANALYTICS=your google analytics code,
- GOOGLE_SITE_VERIFICATION=your google site verification code,
- DATADOG_API_KEY=your data dog api key,
- DATADOG_API_HOST= your data dog api host,
- DATADOG_API_PREFIX= your data dog api prefix,
- DBL_AUTH= your dbl authorization

**The callbacks in Discord's dev portal:**
This will have 2 parts, callback for the main client ID, and the other for the auth client ID. I did this so that the main client doesn't get ratelimited. You can use the same Id for main_client_id and auth_client_id and put the 3 callbacks in the same application.

MAIN CLIENT ID:
- yourdomain/thanks example [https://394wkx-3000.csb.app//thanks](https://394wkx-3000.csb.app//thanks) or [http://localhost:3000/thanks](http://localhost:3000/thanks)
- yourdomain/window example [https://394wkx-3000.csb.app//window](https://394wkx-3000.csb.app//window) or [http://localhost:3000/window](http://localhost:3000/window)

AUTH CLIENT ID:
- yourdomain/callback example [https://394wkx-3000.csb.app//callback](https://394wkx-3000.csb.app//callback) or [http://localhost:3000/callback](http://localhost:3000/callback)

**TOP.gg:**
To add top.gg to your site, add `DBL_AUTH` as your dbl api key to the `.env` file. And `yourdomain/dblwebhook` as a webhook url on top.gg's site settings. Example: `https://yourbot.com/dblwebhook

**Replit:**
To run on replit you must install node js `v.16.9.1` to do so go to bash (the bash terminal on your repl) and paste: `npm init -y && npm i --save-dev node@16.9.0 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH`

Make sure you have enabled `Privileged Intents` on your Discord [developer portal](https://discordapp.com/developers/applications/). You can find these intents under the "Bot" section, and there are two ticks you have to switch on. For more information on Gateway Intents, check out [this](https://discordjs.guide/popular-topics/intents.html#the-intents-bit-field-wrapper) link.

You can launch the bot with `npm start`

**Important Note:** Before you join the support server for help, read the guide carefully.

### Emojis 🎨

- You can change the emojis in: <br>
  1- `assets/emojis.json` <br>
  2- `data/emoji.js`

### Colors 🌈

- You can change the colors in `data/colors.js`

## License 📜
 Copyright Statement: Do not copy this website, if the code is found to be duplicated, reproduced,
    or copied we will fine you a minimum of $250,000 and criminal charges may be pressed.

Released under the [MIT License](LICENSE) license.

## Support 🤝
[Click here for the support server](https://v2.pogy.xyz/support)

## Donate 💸

You can donate and make it stronger than ever [by clicking here](https://paypal.me/pogybot)!

## Credits 🙌
[Old Credits](https://github.com/peterhanania/pogy#credits)
- Peter Hanania [DJS Rewrite] - [github.com/peterhanania](https://github.com/peterhanania)
- JANO [DJS Rewrite] - [github.com/wlegit](https://github.com/wlegit)
- Hotsuop [Added commands & Commands] - [https://github.com/hotsu0p](https://github.com/hotsu0p)
