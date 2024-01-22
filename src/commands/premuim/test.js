const discord = require("discord.js");
const Command = require("../../structures/Command");
const fs = require("fs");
// Add this function at the top of your code
async function fetchGuildRoles(guildId) {
  try {
    const guild = await client.guilds.fetch(guildId);
    const roles = guild.roles.cache.map((role) => ({
      id: role.id,
      name: role.name,
      position: role.position,
    }));
    return roles;
  } catch (error) {
    console.error("Error fetching guild roles:", error);
    return [];
  }
}

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "memberlist",
      aliases: [],
      category: "Utility",
      description: "Get a list of members in the server",
      cooldown: 5,
    });
  }

  async run(message, args) {
    // Replace "guildid" with your actual guild ID
    const guildId = message.guild.id;
    const guildRoles = await fetchGuildRoles(guildId);
    const guild = message.client.guilds.cache.get(guildId);
    console.log(guildRoles);
    if (!guild) {
      return message.channel.send("Guild not found.");
    }

    // Fetch members from the guild
    const members = guild.members.cache.map((member) => ({
      tag: member.user.tag,
      id: member.user.id,
      avatarURL: member.user.displayAvatarURL({ format: "png", dynamic: true }),
      joinedAt: member.joinedAt,
      roles: member.roles.cache.map((role) => role.name),
      isBot: member.user.bot,
      nickname: member.displayName,
      userid: member.user.id,
    }));

    // Generate HTML content
    const htmlContent = `
    <!DOCTYPE html>
    </head>
    </div>
    </div>
    <div class="container-contact">
    <div class="wrap-contact">

    <span class="contact-form-title">List of Members in Hotsuop 🐈✨'s server</span>
            <input type="text" id="filterInput" placeholder="Filter members..." oninput="filterMembers()">
            <img class="fit-picture" src="https://cdn.discordapp.com/avatars/1164910906203967508/e1d708a43be41e07d04dc2b5c44397d0.png" alt="If you see this lol" />
            <button type=" button " class="buttonv2 " onclick="document.getElementById( 'demo').innerHTML=D ate() ">
            Click me to display Date and Time.</button>
                <button onclick="toggleTheme() " class="button ">Toggle Theme</button>
                <button onclick="sortMembers('asc')" class="button">Sort A-Z</button>
                <button onclick="sortMembers('desc')" class="button">Sort Z-A</button>

</div>
    </div>
    </div>
    <div class="glow"></div>
    
    </head>
    <body>
        <h1>List of Members in ${guild.name}</h1>
        <ul class="member-list" id="memberList">
            ${members
              .map(
                (member) => `
                <li class="member-item">
                    <img src="${member.avatarURL}" alt="${
                  member.tag
                }" class="avatar">
                    <div class="user-info">
                        <span class="nickname">${
                          member.nickname
                            ? `${member.nickname} (${member.tag})`
                            : `${member.tag}`
                        }</span>
                        <span class="user-id">ID: ${member.id}</span>
                        <span class="bot-tag">${
                          member.isBot ? "Bot" : "User"
                        }</span>
                        <div class="roles">${member.roles}</div>
                        <span class="joined-at">Joined at: ${member.joinedAt
                          .toUTCString()
                          .substr(0, 16)}</span>
                    </div>
                </li>
              `
              )
              .join("")}
        </ul>
    </body>
    <style>
    .list-title {
        text-align: center;
    }
    
    .list-title:hover {
        color: rgb(158, 153, 153);
        transform: translateY(5px)
    }
    
    .glow {
        width: 80%;
        height: 60px;
        background: linear-gradient(90deg, #181616, #080808);
        position: absolute;
        margin: 0 auto;
        left: 0;
        right: 0;
        border-radius: 50%;
        transform: translateY(-20%);
        filter: blur(160px);
    }
    
    .contact-form-title:hover {
        -webkit-animation: rainbow 2s infinite;
        -ms-animation: rainbow 2s infinite;
        -o-animation: rainbow 2s infinite;
        animation: rainbow 2s infinite;
    }
    
    @-webkit-keyframes rainbow {
        0% {
            color: #ff0000;
        }
        10% {
            color: #ff8000;
        }
        20% {
            color: #ffff00;
        }
        30% {
            color: #80ff00;
        }
        40% {
            color: #00ff00;
        }
        50% {
            color: #00ff80;
        }
        60% {
            color: #00ffff;
        }
        70% {
            color: #0080ff;
        }
        80% {
            color: #0000ff;
        }
        90% {
            color: #8000ff;
        }
        100% {
            color: #ff0080;
        }
    }
    
    @-ms-keyframes rainbow {
        0% {
            color: #ff0000;
        }
        10% {
            color: #ff8000;
        }
        20% {
            color: #ffff00;
        }
        30% {
            color: #80ff00;
        }
        40% {
            color: #00ff00;
        }
        50% {
            color: #00ff80;
        }
        60% {
            color: #00ffff;
        }
        70% {
            color: #0080ff;
        }
        80% {
            color: #0000ff;
        }
        90% {
            color: #8000ff;
        }
        100% {
            color: #ff0080;
        }
    }
    
    @-o-keyframes rainbow {
        0% {
            color: #ff0000;
        }
        10% {
            color: #ff8000;
        }
        20% {
            color: #ffff00;
        }
        30% {
            color: #80ff00;
        }
        40% {
            color: #00ff00;
        }
        50% {
            color: #00ff80;
        }
        60% {
            color: #00ffff;
        }
        70% {
            color: #0080ff;
        }
        80% {
            color: #0000ff;
        }
        90% {
            color: #8000ff;
        }
        100% {
            color: #ff0080;
        }
    }
    
    @keyframes rainbow {
        0% {
            color: #ff0000;
        }
        10% {
            color: #ff8000;
        }
        20% {
            color: #ffff00;
        }
        30% {
            color: #80ff00;
        }
        40% {
            color: #00ff00;
        }
        50% {
            color: #00ff80;
        }
        60% {
            color: #00ffff;
        }
        70% {
            color: #0080ff;
        }
        80% {
            color: #0000ff;
        }
        90% {
            color: #8000ff;
        }
        100% {
            color: #ff0080;
        }
    }
    
    body {
        background-color: #000;
        align-items: center;
        color: aliceblue;
        font-family: 'Arial', sans-serif;
    }
    
    .user-id {
        font-family: Arial;
        &:hover {
            color: rgb(158, 153, 153);
            transform: translate(1px, 1px);
            cursor: help;
        }
    }
    
    .header2 {
        border: 5px outset rgb(40, 41, 43);
        background: linear-gradient(to right, #101111, #2b302e);
        text-align: center;
    }
    
    .member-list {
        list-style-type: none;
        padding: 0;
    }
    
    .member-item {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
    }
    
    .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 10px;
        &:hover {
            -webkit-transform: scale(1.1);
            -ms-transform: scale(1.1);
            transform: scale(1.1);
            transition: .2s ease;
        }
    }
    
    .user-info {
        display: flex;
        flex-direction: column;
    }
    
    .nickname {
        font-weight: bold;
        &:hover {
            color: rgb(158, 153, 153);
            transform: translate(1px, 1px);
        }
    }
    
    .bot-tag {
        color: #7289DA;
        /* Discord bot tag color */
        &:hover {
            translate: 1px;
            color: #41528d;
        }
    }
    
    .avatar {
        padding: auto;
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        margin: 10px;
        position: absolute;
        object-position: right;
    }
    
    .fit-picture {
        width: 59px;
        border-radius: 50%;
        margin-right: 10px;
        width: 5%;
        object-fit: cover;
        object-position: right top;
    }
    
    .wrap-contact {
        width: 100%;
        padding: 20px;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
        background-color: #202225;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .contact-form-title {
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        margin-right: 20px;
    }
    
    .fit-picture {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 20px;
    }
    
    .joined-at {
        &:hover {
            color: rgb(158, 153, 153);
            transform: translate(1px, 1px);
            font-weight: bold;
        }
    }
    
    .button {
        background-color: #7289da;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .button:hover {
        background-color: #5865f2;
    }
    
    .buttonv2 {
        background-color: #4caf50;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .buttonv2:hover {
        background-color: #45a049;
    }
    #filterInput {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
  font-size: 14px;
}

#filterInput:focus {
  outline: none;
  border-color: #3498db; /* Change the border color on focus */
}
    .roles {
        display: none;
        margin-top: 5px;
        font-size: 14px;
        color: #2ECC71;
    }
    
    .nickname:hover .roles,
    .nickname.active .roles {
        display: block;
    }
    
    .user-id:hover .roles,
    .user-id.active .roles {
        display: block;
    }
    
    .nickname:hover .roles,
    .nickname.active .roles {
        display: block;
    }
    
    .bot-tag:hover .roles,
    .bot-tag.active .roles {
        display: block;
    }
</style>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const memberItems = document.querySelectorAll('.member-item');

        memberItems.forEach(memberItem => {
            const nickname = memberItem.querySelector('.nickname');
            const roles = memberItem.querySelector('.roles');

            nickname.addEventListener('mouseenter', function() {
                roles.style.display = 'block';
            });

            nickname.addEventListener('mouseleave', function() {
                roles.style.display = 'none';
            });
        });
    });
    document.addEventListener('DOMContentLoaded', function() {
        const memberItems = document.querySelectorAll('.member-item');

        memberItems.forEach(memberItem => {
            const nickname = memberItem.querySelector('.user-id');
            const roles = memberItem.querySelector('.roles');

            nickname.addEventListener('mouseenter', function() {
                roles.style.display = 'block';
            });

            nickname.addEventListener('mouseleave', function() {
                roles.style.display = 'none';
            });
        });
    });
    document.addEventListener('DOMContentLoaded', function() {
        const memberItems = document.querySelectorAll('.member-item');

        memberItems.forEach(memberItem => {
            const nickname = memberItem.querySelector('.bot-tag');
            const roles = memberItem.querySelector('.roles');

            nickname.addEventListener('mouseenter', function() {
                roles.style.display = 'block';
            });

            nickname.addEventListener('mouseleave', function() {
                roles.style.display = 'none';
            });
        });
    });

    function sortMembers(order) {
        const memberList = document.querySelector('.member-list'); // Corrected the selector
        const members = memberList.querySelectorAll('.member-item'); // Updated the class name

        // Convert NodeList to array
        const memberEntries = Array.from(members);

        // Sort the array
        memberEntries.sort((a, b) => {
            const nameA = a.querySelector('.nickname').textContent.toLowerCase(); // Updated the class name
            const nameB = b.querySelector('.nickname').textContent.toLowerCase(); // Updated the class name

            if (order === 'asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });

        // Remove existing members
        memberList.innerHTML = '';

        // Add sorted members back to list
        memberEntries.forEach(member => {
            memberList.appendChild(member);
        });
    }
    const colorThemes = [{
        background: "linear-gradient(to right, #0D1117, #1F6F8B) ",
        color: "#C9D1D9 ",
        detailsSummary: "background: #1F6F8B; ",
    }, {
        background: "linear-gradient(to right, #1c1c1d, #182848) ",
        color: "#fff ",
        detailsSummary: "background: #04AA6D; ",
    }, {
        background: "linear-gradient(to right, #2c3e50, #3498db) ",
        color: "#ecf0f1 ",
        detailsSummary: "background: #3498db; ",
    }, {
        background: "linear-gradient(to right, #007991, #78ffd6) ",
        color: "#202020 ",
        detailsSummary: "background: #78ffd6; ",
    }, {
        background: "linear-gradient(to right, #360033, #0b8793) ",
        color: "#e0e0e0 ",
        detailsSummary: "background: #0b8793; ",
    }, ];



    let themeIndex = 0;

    function toggleTheme() {
        const body = document.body;

        // Cycle through color themes
        themeIndex = (themeIndex + 1) % colorThemes.length;
        document.querySelectorAll("details summary ").forEach(summary => {
            summary.style.cssText = colorThemes[themeIndex].detailsSummary;
        });

        // Apply the current color theme
        body.style.background = colorThemes[themeIndex].background;
        body.style.color = colorThemes[themeIndex].color;
    }

    function myFunction() {
        var popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
    }

    function filterMembers() {
        // Get the filter input value
        const filterValue = document.getElementById('filterInput').value.toLowerCase();

        // Get the member list container
        const memberList = document.getElementById('memberList');

        // Get all member items
        const members = memberList.querySelectorAll('.member-item');

        // Iterate through members and show/hide based on filter
        members.forEach(member => {
            const nickname = member.querySelector('.nickname').textContent.toLowerCase();

            // Check if the nickname includes the filter value
            if (nickname.includes(filterValue)) {
                member.style.display = 'flex'; // Show the member
            } else {
                member.style.display = 'none'; // Hide the member
            }
        });
    }
    function filterByRoleHierarchy(type) {
  const memberList = document.querySelector('.member-list');
  const members = memberList.querySelectorAll('.member-item');

  members.forEach(member => {
    const rolesElement = member.querySelector('.roles');
    const roles = rolesElement.textContent.split(',');


    if (type === 'higher' && roles.includes('Moderator')) {

      member.style.display = 'block';
    } else if (type === 'lower' && roles.includes('Member')) {

      member.style.display = 'block';
    } else {
      member.style.display = 'none'; 
    }
  });
}
</script>
    `;

    // Write HTML content to a file
    const filePath = "./memberList.html";
    fs.writeFileSync(filePath, htmlContent, "utf-8");

    // Send the HTML file
    message.channel.send({ files: [filePath] });
  }
};
