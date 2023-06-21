const setExternals = (isEnvProduction) => {
  return isEnvProduction ? {
  } : {};
}

module.exports = {
  setExternals
}