const _ = require('lodash')
const shuffle = require('knuth-shuffle-seeded')
const { findProductsWithTag } = require('./util')
const { printWeeklySchedules, printSessionsAndImpressions } = require('./info')

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

function generatePreferredProductsPool(userPreferences, products) {
  const allProducts = []
  _.forEach(userPreferences.preferences, (preference) => {
    const foundProducts = findProductsWithTag(products, preference.tag)
    _.forEach(foundProducts, (product) => {
      if (preference.howMuchThePersonLikesTheseProducts < 1) {
        throw new Error(`"howMuchThePersonLikesTheseProducts" must be greater than or equal to 1`)
      }

      for (let i = 0; i < preference.howMuchThePersonLikesTheseProducts; ++i) {
        allProducts.push(product)
      }
    })
  })

  return allProducts
}

function getRandomItem(arr, rng) {
  const randomIndex = Math.floor(rng() * arr.length)
  return arr[randomIndex]
}

function generateWeeklySchedule(userPreferences, products, opts) {
  const preferredProducts = generatePreferredProductsPool(userPreferences, products, opts)
  const weekSchedule = _.map(WEEKDAYS, (weekday) => {
    const randomProducts = _.map(_.range(10), () => opts.getRandomItem(preferredProducts))

    return {
      day: weekday,
      purchases: _.map(randomProducts, (product) => {
        return {
          id: product.id,
          name: product.name,
        }
      })
    }
  })

  return weekSchedule
}

// Generates a weekly purchase schedule for all users based on their preferences
function generateWeeklySchedules(inputData, opts = {}) {
  const data = _.extend({}, inputData, {
    products: shuffle(inputData.products, opts.rng)
  })

  const newOpts = {
    getRandomItem: (arr) => getRandomItem(arr, opts.rng)
  }

  const weeklySchedules = _.map(data.preferences, (userPreferences) => {
    const userWeeklySchedule = generateWeeklySchedule(userPreferences, data.products, newOpts)
    return {
      username: userPreferences.username,
      weeklyPurchases: userWeeklySchedule,
    }
  })

  printWeeklySchedules(inputData, weeklySchedules)

  return weeklySchedules
}

// Find products which are never purchased by the user
function getSimulatedOtherProducts(products, userSchedule, day, maxCount) {
  const dayPurchases = _.find(userSchedule.weeklyPurchases, item => item.day === day)
  if (!dayPurchases) {
    throw new Error(`Unable to find purchases for user ${userSchedule.username} for ${day}`)
  }

  // Unique products which the person is purchasing on the given day
  const uniqueProductIdsDay = _.uniq(_.map(dayPurchases.purchases, 'id'))
  // Unique products which the person purchases at least on one day(=they like these products)
  const allTimeProducts = _.flatMap(userSchedule.weeklyPurchases, w => w.purchases)
  const uniqueProductIdsAllTime = _.uniq(_.map(allTimeProducts, 'id'))

  // Find all the products which the user is *not* purchasing
  // XXX: To make this more realistic, we could add a few products in this list, which
  //      the person purchases on another day. It would make sense to implement this additional
  //      realism if we had a simulation of the persons inventory at home.
  //      With the current random implementation it doesn't make that sensible patterns
  const otherProducts = _.filter(products, product => !_.includes(uniqueProductIdsAllTime, product.id))
  return _.take(otherProducts, maxCount)
}

function generateSessionsAndImpressions(inputData, weeklySchedule, opts = {}) {
  const sessions = []
  const impressions = []

  _.forEach(_.range(opts.simulateWeeks), (weekIndex) => {
    _.forEach(weeklySchedule.weeklyPurchases, (dayPurchases) => {
      const { day } = dayPurchases
      // In reality the session id would be for example a UUID, but any unique string works.
      // We want to make the data as readable as possible.
      const sessionId = `${weeklySchedule.username}-week${weekIndex}-${day}`

      const session = { id: sessionId, user: weeklySchedule.username }
      sessions.push(session)

      const otherProducts = getSimulatedOtherProducts(
        inputData.products,
        weeklySchedule,
        day,
        // If the dayPurchases contained 10 items, simulation would create impressions
        // as if the user had seen 20 products in the shop "shelf", but bought only 10 of them
        dayPurchases.purchases.length
      )
      _.forEach(otherProducts, (product) => {
        const impression = { session: sessionId, product: product.id, purchase: false }
        impressions.push(impression)
      })

      _.forEach(dayPurchases.purchases, (partialProduct) => {
        // The partialProduct may not have all information of the product, but id should be.
        const impression = { session: sessionId, product: partialProduct.id, purchase: true }
        impressions.push(impression)
      })
    })
  })

  return {
    sessions,
    impressions
  }
}

// Generates data to be uploaded to Aito based on weekly purchase schedule for each user
function generate(inputData, opts = {}) {
  const outputData = {
    users: [],
    sessions: [],
    impressions: [],
  }

  const data = _.extend({}, inputData, {
    products: shuffle(inputData.products, opts.rng)
  })

  _.forEach(data.weeklySchedules, (userSchedule) => {
    outputData.users.push({ username: userSchedule.username })

    const { impressions, sessions } = generateSessionsAndImpressions(data, userSchedule, opts)
    _.forEach(impressions, i => outputData.impressions.push(i))
    _.forEach(sessions, s => outputData.sessions.push(s))
  })

  printSessionsAndImpressions(inputData, outputData.sessions, outputData.impressions)

  return outputData
}

module.exports = {
  generateWeeklySchedules,
  generate
}
