const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Workaround para Windows path issue
config.resolver = config.resolver || {};
config.resolver.resolverMainFields = ['react.native', 'browser', 'main'];

module.exports = config;