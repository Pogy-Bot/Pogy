function getRoleForLevel(level, guildId, userId, userData) {
  if (!userData.guilds[guildId]?.users[userId]) {
    return null;
  }

  const { levelUpRoles } = userData.guilds[guildId];

  if (!levelUpRoles) {
    return null;
  }

  const userLevel = userData.guilds[guildId].users[userId].level;

  // Find the role ID for the current user's level
  const roleForLevel = levelUpRoles.find((role) => role.level === userLevel);

  return roleForLevel?.roleId || null;
}

module.exports = { getRoleForLevel };