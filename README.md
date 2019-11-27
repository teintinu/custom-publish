# custom-publish
Custumized npm publishing

when you change version property in package.json custom-publish with auto-deploy your package to npmjs

# install

npm install custom-publish

# usage

npx custom-publish [custom-publish-config.js]

# options

module.exports = {
  tag: true, // tag and push the version to github
  canPublish (currentVersion, newVersion) {
    if (same) console.log('current:', currentVersion, 'already deployed')
    return !same // just publush when version was changed
  },
  afterPublish (newVersion) {
    // here you can add statements to run after publishing
    console.log('deployed version:', newVersion, ' successfully')
  }
}

# github tagging

to tag and push the version to github use must set environment
GITHUB_REPOSITORY=user/project
GITHUB_ACTOR=user
GITHUB_TOKEN=github token
