#!/usr/bin/env node

const path = require('path')
const { execSync } = require('child_process')
const pkg = require(path.join(process.cwd(), 'package.json'))

const configFile = process.argv[2] || './default-config'
const opts = require(configFile)

const currentVersion = getCurrent()
const newVersion = pkg.version

if (opts.tag) {
  if (!process.env.GITHUB_REPOSITORY) {
    console.log('custom-publish with tag option requires GITHUB_REPOSITORY')
    process.exit(1)
  }
  if (!process.env.GITHUB_ACTOR) {
    console.log('custom-publish with tag option requires GITHUB_ACTOR')
    process.exit(1)
  }
  if (!process.env.GITHUB_TOKEN) {
    console.log('custom-publish with tag option requires GITHUB_TOKEN')
    process.exit(1)
  }
}

if (opts.canPublish(currentVersion, newVersion)) {
  exec('npm publish --access=public')
  if (opts.tag) {
    exec(`git tag ${newVersion}`)
    const repo = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`
    exec(`git push "${repo}" --tags`)
  }
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
