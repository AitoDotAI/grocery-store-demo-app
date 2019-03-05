const _ = require('lodash')
const yargs = require('yargs')

const VERSION = require('../../package.json').version

const defaultOpts = {
  info: false,
  onlyWeeklySchedules: false,
  simulateWeeks: 8,
}

function getUserOpts() {
  const userOpts = yargs
    .usage('Usage: $0 [options]')
    .example('$0')

    .option('info', {
      describe: 'Show information about products',
      default: defaultOpts.info,
      type: 'boolean',
    })

    .option('only-weekly-schedules', {
      describe: 'Only generate weekly schedules',
      default: defaultOpts.onlyWeeklySchedules,
      type: 'boolean',
    })

    .option('simulate-weeks', {
      describe: 'How many weeks of shopping history to simulate',
      default: defaultOpts.simulateWeeks,
      type: 'number',
    })
    .alias('w', 'simulate-weeks')

    .help('h')
    .alias('h', 'help')
    .alias('v', 'version')
    .version(VERSION)
    .argv

  return userOpts
}

function throwCliError(message) {
  const err = new Error(message)
  err.cliError = true
  throw err
}

async function validateAndTransformOpts(opts) {
  if (!_.isFinite(opts.simulateWeeks)) {
    return throwCliError(`--simulate-weeks must be a number.`)
  }

  // Transform opts if needed
  return opts
}

async function getOpts() {
  const userOpts = getUserOpts()
  const opts = _.merge(defaultOpts, userOpts)
  const finalOpts = await validateAndTransformOpts(opts)
  return finalOpts
}

module.exports = {
  getOpts,
}
