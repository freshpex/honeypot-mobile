const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  ...expoConfig,
  {
    ignores: [".expo", "coverage", "dist", "node_modules"],
  },
];

