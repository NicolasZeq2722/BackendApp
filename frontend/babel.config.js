module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // No agregamos plugins manuales para evitar conflictos con reanimated
  };
};