const _ = require('lodash')
const chalk = require('chalk')
const Table = require('cli-table')
const { getProductTags, findProductsWithTag, findProductById } = require('./util')

function createCliTable(head) {
  return new Table({
    chars: {
      'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
      'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
      'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': '',
      'right': '' , 'right-mid': '' , 'middle': ' ' ,
    },
    style: {
      'padding-left': 2,
      'padding-right': 0,
      head: ['white'],
      border: ['grey']
    },
    head,
  })
}

function getUniqueTags(products) {
  return _.sortBy(_.uniq(_.flatMap(products, product => getProductTags(product))))
}

function printWeeklySchedules(data, weeklySchedules) {
  console.log('')
  _.forEach(weeklySchedules, (userSchedule) => {
    console.log(chalk.bold(`${userSchedule.username}:`))
    _.forEach(userSchedule.weeklyPurchases, (dayPurchases) => {
      console.log(chalk.bold(`  ${dayPurchases.day} (${userSchedule.username}):`))
      _.forEach(dayPurchases.purchases, (purchase) => {
        const product = findProductById(data.products, purchase.id)
        const text = `${chalk.gray(product.id)} ${chalk.gray(product.name)}`
        console.log(`    ${text}`)
      })
      console.log('')
    })
    console.log('\n')
  })
}

function printSessionsAndImpressions(data, sessions, impressions) {
  console.log('')
  const impressionsBySessionId = _.groupBy(impressions, 'session')
  _.forEach(sessions, (session) => {
    console.log(chalk.bold(`${session.id}:`))

    const table = createCliTable(['productId', 'purchase', 'tags', 'name'])
    const impressions = impressionsBySessionId[session.id]
    _.forEach(impressions, (impression) => {
      const product = _.find(data.products, p => p.id === impression.product)
      const purchaseX = impression.purchase ? '[x]': '[ ]'
      table.push([product.id, purchaseX, getProductTags(product).join(', '), product.name])
    })
    console.log(chalk.gray(table.toString()))
    console.log('\n')
  })
}


function printInfo(data) {
  const tags = getUniqueTags(data.products)
  console.log(chalk.bold('All product tags:'))
  _.forEach(tags, (tag) => {
    console.log(`  ${tag}`)

    const products = findProductsWithTag(data.products, tag)
    _.forEach(products, (product) => {
      const text = `${chalk.gray(product.id)} ${chalk.gray(product.name)}`
      console.log(`    ${text}`)
    })
    console.log('')
  })
}

module.exports = {
  printWeeklySchedules,
  printSessionsAndImpressions,
  printInfo,
}
