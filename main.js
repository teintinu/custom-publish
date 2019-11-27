const path = require('path')
const { execSync } = require('child_process')
const pkg = require(path.join(process.cwd(), 'package.json'))

const configFile = process.argv[2] || './default-config'
const opts = require(configFile)

const currentVersion = getCurrent()
const newVersion = pkg.version

console.log(JSON.stringify(process.env))

if (opts.canPublish(currentVersion, newVersion)) {
  if (opts.tag) {
    exec(`git tag ${newVersion}`)
    const repo = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.REPOSITORY}.git`
    exec(`it push ${repo} --tags`)
  }
  exec('npm publish --access=public')
  opts.afterPublish && opts.afterPublish(newVersion)
}

function getCurrent () {
  try {
    return execSync(`npm view "${pkg.name}" version`).toString().trim()
  } catch (e) {
    console.log(e)
    return '?'
  }
}

function exec (str) {
  console.log('')
  console.log('')
  console.log('deploy$ ', str)
  try {
    process.stdout.write(execSync(str))
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}
