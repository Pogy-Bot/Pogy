const { ClusterManager } = require("discord-hybrid-sharding");
const manager = new ClusterManager(`${__dirname}/bot.js`, {
  shardsPerCluster: 4,
  mode: "process",
  token: process.env.TOKEN,
});

manager.on("clusterCreate", (cluster) =>
  console.log(`Launched Cluster ${cluster.id}`),
);
manager.spawn({ timeout: -1 });
