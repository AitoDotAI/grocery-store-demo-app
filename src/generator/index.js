const path = require('path')
const fs = require('fs')
const BPromise = require('bluebird')
const _ = require('lodash')
const seedRandom = require('seed-random')
const cliParser = require('./cliParser')
const { printInfo } = require('./info')
const stringify = require('@aitodotai/json-stringify-pretty-compact')
const { generateWeeklySchedules, generate, fileExists } = require('./generator')

BPromise.promisifyAll(fs)
const REPO_ROOT = path.join(__dirname, '../..')

async function readJsonFile(filePath) {
  const fileContents = await fs.readFileAsync(filePath, { encoding: 'utf8' })
  return JSON.parse(fileContents)
}

function jsonStringify(obj) {
  return stringify(obj, { maxLength: Infinity, maxNesting: 1 })
}

async function main() {
  const opts = _.extend({}, await cliParser.getOpts(), {
    // To create random but stabile patterns
    rng: seedRandom(1),
  })

  const data = {
    preferences: await readJsonFile(path.join(REPO_ROOT, 'src/data/preferences.json')),
    products: await readJsonFile(path.join(REPO_ROOT, 'src/data/products.json')),
  }

  if (opts.info) {
    return printInfo(data)
  }

  const weeklySchedulesFilePath = path.join(REPO_ROOT, 'src/data/generated/weeklySchedules.json')
  try {
    data.weeklySchedules = await readJsonFile(weeklySchedulesFilePath)
  } catch (e) {
    console.log(`Unable to read weekly schedules from ${weeklySchedulesFilePath}, regenerating it ..`)
  }

  if (opts.onlyWeeklySchedules || !data.weeklySchedules) {
    const weeklySchedules = generateWeeklySchedules(data, opts)
    fs.writeFileSync(weeklySchedulesFilePath, jsonStringify(weeklySchedules))
    console.log('Wrote weekly schedules to', weeklySchedulesFilePath)

    data.weeklySchedules = weeklySchedules
  }

  if (opts.onlyWeeklySchedules) {
    return
  }

  console.log(`Generating simulated data for ${opts.simulateWeeks} weeks based on weekly schedule ..`)
  const generatedData = generate(data, opts)
  _.forEach(generatedData, (val, key) => {
    const filePath = path.join(REPO_ROOT, `src/data/aito/${key}.json`)
    fs.writeFileSync(filePath, jsonStringify(val))
    console.log(`Wrote ${key} to`, filePath)
  })

  console.log('Copying products.json to src/data/aito/ directory..')
  fs.copyFileSync(
    path.join(REPO_ROOT, 'src/data/products.json'),
    path.join(REPO_ROOT, 'src/data/aito/products.json')
  )
}

main()
  .catch((err) => {
    if (err.cliError) {
      console.log(err.message)
      process.exit(2)
    }

    console.error('\n')
    console.error(err.stack || err)
    process.exit(1)
  })
