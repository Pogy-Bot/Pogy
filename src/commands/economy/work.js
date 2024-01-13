const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Profile = require("../../database/models/economy/profile.js");
const { createProfile } = require("../../utils/utils");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "work",
      description: "Earn money by working",
      category: "Economy",
      cooldown: 30,
    });
  }

  async run(message) {
    try {
      const profile = await Profile.findOne({
        userID: message.author.id,
        guildId: message.guild.id,
      });

      if (!profile) {
        await createProfile(message.author, message.guild);
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor("BLURPLE")
              .setDescription(
                "Creating profile. Use this command again after a while to work."
              ),
          ],
        });
      }

      const jobOptions = [
        { name: "Programmer", minEarnings: 100, maxEarnings: 200, xp: 50 },
        { name: "Artist", minEarnings: 150, maxEarnings: 250, xp: 60 },
        { name: "Writer", minEarnings: 120, maxEarnings: 180, xp: 40 },
        { name: "Nurse", minEarnings: 100, maxEarnings: 150, xp: 50 },
        { name: "Teacher", minEarnings: 150, maxEarnings: 200, xp: 60 },
        { name: "Doctor", minEarnings: 120, maxEarnings: 180, xp: 40 },
        { name: "Lawyer", minEarnings: 100, maxEarnings: 150, xp: 50 },
        { name: "Accountant", minEarnings: 150, maxEarnings: 200, xp: 60 },
        { name: "Teacher", minEarnings: 120, maxEarnings: 180, xp: 40 },
        { name: "Lawyer", minEarnings: 100, maxEarnings: 150, xp: 50 },
        { name: "Doctor", minEarnings: 120, maxEarnings: 180, xp: 60 },
        {
          name: "Software Engineer",
          minEarnings: 80,
          maxEarnings: 130,
          xp: 40,
        },
        { name: "Graphic Designer", minEarnings: 60, maxEarnings: 100, xp: 30 },
        { name: "Teacher", minEarnings: 50, maxEarnings: 90, xp: 25 },
        { name: "Chef", minEarnings: 70, maxEarnings: 110, xp: 35 },
        { name: "Police Officer", minEarnings: 60, maxEarnings: 100, xp: 30 },
        { name: "Firefighter", minEarnings: 55, maxEarnings: 95, xp: 28 },
        { name: "Architect", minEarnings: 90, maxEarnings: 140, xp: 45 },
        {
          name: "Marketing Manager",
          minEarnings: 75,
          maxEarnings: 120,
          xp: 38,
        },
        { name: "Nurse", minEarnings: 55, maxEarnings: 90, xp: 27 },
        { name: "Electrician", minEarnings: 40, maxEarnings: 70, xp: 20 },
        { name: "Plumber", minEarnings: 45, maxEarnings: 75, xp: 23 },
        { name: "Psychologist", minEarnings: 110, maxEarnings: 160, xp: 55 },
        {
          name: "Financial Analyst",
          minEarnings: 85,
          maxEarnings: 130,
          xp: 42,
        },
        { name: "Actor", minEarnings: 70, maxEarnings: 110, xp: 35 },
        { name: "Dentist", minEarnings: 120, maxEarnings: 170, xp: 60 },
        { name: "Journalist", minEarnings: 60, maxEarnings: 100, xp: 30 },
        { name: "Barista", minEarnings: 30, maxEarnings: 50, xp: 15 },
        { name: "Librarian", minEarnings: 45, maxEarnings: 80, xp: 22 },
        { name: "Mechanic", minEarnings: 50, maxEarnings: 85, xp: 25 },
        { name: "Pharmacist", minEarnings: 90, maxEarnings: 140, xp: 45 },
        { name: "Photographer", minEarnings: 55, maxEarnings: 95, xp: 28 },
        {
          name: "Real Estate Agent",
          minEarnings: 65,
          maxEarnings: 110,
          xp: 32,
        },
        { name: "Social Worker", minEarnings: 50, maxEarnings: 85, xp: 25 },
        { name: "Translator", minEarnings: 40, maxEarnings: 70, xp: 20 },
        { name: "Veterinarian", minEarnings: 100, maxEarnings: 150, xp: 50 },
        { name: "Web Developer", minEarnings: 80, maxEarnings: 120, xp: 40 },
        { name: "Zookeeper", minEarnings: 45, maxEarnings: 75, xp: 23 },
        { name: "Astronomer", minEarnings: 110, maxEarnings: 160, xp: 55 },
        { name: "Biologist", minEarnings: 70, maxEarnings: 110, xp: 35 },
        { name: "Chiropractor", minEarnings: 120, maxEarnings: 170, xp: 60 },
        { name: "Dietitian", minEarnings: 60, maxEarnings: 100, xp: 30 },
        { name: "Economist", minEarnings: 85, maxEarnings: 130, xp: 42 },
        { name: "Fashion Designer", minEarnings: 50, maxEarnings: 90, xp: 25 },
        { name: "Geologist", minEarnings: 55, maxEarnings: 95, xp: 28 },
        { name: "Hairdresser", minEarnings: 30, maxEarnings: 50, xp: 15 },
        { name: "IT Consultant", minEarnings: 90, maxEarnings: 140, xp: 45 },
        { name: "Linguist", minEarnings: 40, maxEarnings: 70, xp: 20 },
        { name: "Meteorologist", minEarnings: 65, maxEarnings: 110, xp: 32 },
        { name: "Nutritionist", minEarnings: 50, maxEarnings: 85, xp: 25 },
        { name: "Optometrist", minEarnings: 55, maxEarnings: 90, xp: 27 },
        { name: "Pilot", minEarnings: 80, maxEarnings: 130, xp: 40 },
        { name: "Quantity Surveyor", minEarnings: 45, maxEarnings: 80, xp: 22 },
        { name: "Radiographer", minEarnings: 50, maxEarnings: 85, xp: 25 },
        { name: "Surveyor", minEarnings: 60, maxEarnings: 100, xp: 30 },
        { name: "Technical Writer", minEarnings: 70, maxEarnings: 110, xp: 35 },
        { name: "Urologist", minEarnings: 100, maxEarnings: 150, xp: 50 },
        {
          name: "Video Game Developer",
          minEarnings: 80,
          maxEarnings: 120,
          xp: 40,
        },
        { name: "Welder", minEarnings: 40, maxEarnings: 70, xp: 20 },
        { name: "X-ray Technician", minEarnings: 55, maxEarnings: 95, xp: 28 },
        { name: "YouTuber", minEarnings: 30, maxEarnings: 50, xp: 15 },
        { name: "Zoologist", minEarnings: 70, maxEarnings: 110, xp: 35 },
        { name: "Acupuncturist", minEarnings: 60, maxEarnings: 100, xp: 30 },
        { name: "Bank Teller", minEarnings: 35, maxEarnings: 60, xp: 17 },
        { name: "Carpenter", minEarnings: 45, maxEarnings: 80, xp: 22 },
        { name: "Dog Trainer", minEarnings: 30, maxEarnings: 50, xp: 15 },
        { name: "Event Planner", minEarnings: 55, maxEarnings: 90, xp: 27 },
        {
          name: "Forensic Scientist",
          minEarnings: 90,
          maxEarnings: 140,
          xp: 45,
        },
        {
          name: "Genetic Counselor",
          minEarnings: 70,
          maxEarnings: 110,
          xp: 35,
        },
        { name: "Horticulturist", minEarnings: 40, maxEarnings: 70, xp: 20 },
        { name: "Interpreter", minEarnings: 50, maxEarnings: 85, xp: 25 },
        { name: "Jeweler", minEarnings: 60, maxEarnings: 100, xp: 30 },
        { name: "Kitchen Designer", minEarnings: 45, maxEarnings: 75, xp: 23 },
        { name: "Lobbyist", minEarnings: 80, maxEarnings: 120, xp: 40 },
        { name: "Marine Biologist", minEarnings: 70, maxEarnings: 110, xp: 35 },
        {
          name: "Nuclear Engineer",
          minEarnings: 100,
          maxEarnings: 150,
          xp: 50,
        },
        {
          name: "Occupational Therapist",
          minEarnings: 60,
          maxEarnings: 100,
          xp: 30,
        },
        { name: "Park Ranger", minEarnings: 40, maxEarnings: 70, xp: 20 },
        {
          name: "Quantum Physicist",
          minEarnings: 110,
          maxEarnings: 160,
          xp: 55,
        },
        { name: "R&D Manager", minEarnings: 85, maxEarnings: 130, xp: 42 },
        {
          name: "Social Media Manager",
          minEarnings: 50,
          maxEarnings: 90,
          xp: 25,
        },
        { name: "Tax Advisor", minEarnings: 55, maxEarnings: 95, xp: 28 },
        { name: "Urban Planner", minEarnings: 70, maxEarnings: 110, xp: 35 },
      ];

      const selectedJob =
        jobOptions[Math.floor(Math.random() * jobOptions.length)];

      const earnings = Math.floor(
        Math.random() *
          (selectedJob.maxEarnings - selectedJob.minEarnings + 1) +
          selectedJob.minEarnings
      );

      const now = Date.now();
      const xpGained = selectedJob.xp;
      await Profile.updateOne(
        { userID: message.author.id, guildId: message.guild.id },
        {
          $inc: { wallet: earnings, xp: xpGained },
          $set: {
            "cooldowns.work": now,
            lastWork: now,
          },
        }
      );

      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`${message.author.username}'s Work - ${selectedJob.name}`)
            .setDescription(
              `You worked as a ${selectedJob.name} and earned $${earnings}.`
            ),
        ],
      });
    } catch (error) {
      console.error("Error occurred:", error);
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("An error occurred while processing the command."),
        ],
      });
    }
  }

  calculateRequiredXP(level) {
    return Math.pow(level * 100, 2);
  }
};
