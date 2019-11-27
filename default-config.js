module.exports = {
  tag: true,
  canPublish (currentVersion, newVersion) {
    if (!process.env.NPM_CONFIG_TOKEN) {
      console.log('Merge-release requires NPM_CONFIG_TOKEN')
      process.exit(1)
    }
    const same = currentVersion === newVersion
    if (same) console.log('current:', currentVersion, 'already deployed')
    return !same
  },
  afterPublish (newVersion) {
    console.log('deployed version:', newVersion, ' successfully')
  }
}
