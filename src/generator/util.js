const fs = require('fs')
const _ = require('lodash')

function fileExists(filePath) {
  return fs.statAsync(filePath)
    .then(stats => stats.isFile())
    .catch((err) => {
      if (err.code === 'ENOENT') {
        return false
      }

      throw err
    })
}

function getProductTags(product) {
  return product.tags.split(' ')
}

function findProductsWithTag(products, tag) {
  const foundProducts = _.filter(products, (product) => {
    const tags = getProductTags(product)
    return _.includes(tags, tag)
  })

  return _.sortBy(foundProducts, 'name')
}

function findProductById(products, id) {
  return _.find(products, p => p.id === id)
}

module.exports = {
  fileExists,
  findProductsWithTag,
  getProductTags,
  findProductById,
}
