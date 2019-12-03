#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const pkg = require(path.join(process.cwd(), 'package.json'))

const configFile = process.argv[2] || './default-config'
const opts = require(configFile)

const currentVersion = getCurrent()
const newVersion = pkg.version

let GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY
let GITHUB_ACTOR = process.env.GITHUB_ACTOR
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

if (opts.tag) {
  if (!GITHUB_REPOSITORY) {
    GITHUB_REPOSITORY = getRepository()
    if (GITHUB_REPOSITORY) {
      console.log('GITHUB_REPOSITORY =', GITHUB_REPOSITORY)
      GITHUB_ACTOR = GITHUB_REPOSITORY.split('/')[0]
      console.log('GITHUB_ACTOR =', GITHUB_ACTOR)
    } else {
      console.log('custom-publish with tag option requires GITHUB_REPOSITORY')
      process.exit(1)
    }
  }
  if (!GITHUB_ACTOR) {
    console.log('custom-publish with tag option requires GITHUB_ACTOR')
    process.exit(1)
  }
  if (!GITHUB_TOKEN) {
    console.log('custom-publish with tag option requires GITHUB_TOKEN')
    process.exit(1)
  }
}

if (opts.canPublish(currentVersion, newVersion)) {
  exec('npm publish --access=public')
  if (opts.tag) {
    exec(`git tag ${newVersion}`)
    const repo = `https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git`
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

function getRepository () {
  try {
    const gitconfig = fs.readFileSync('.git/config', 'utf-8')
    const m = /^\s*url.*github\.com\/(.*)\.git\s*$/gm.exec(gitconfig)
    if (m) return m[1]
  } catch (e) {
    console.log(e)
  }
}
