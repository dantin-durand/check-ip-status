module.exports = {
  apps: [
    {
      name: "monitoring",
      script: "./index.js",
      watch: true,
      ignore_watch: ["node_modules", "status.txt"],
    },
  ],
};
