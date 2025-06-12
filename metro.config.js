const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  string_decoder: require.resolve("string_decoder"),
};

module.exports = config;
