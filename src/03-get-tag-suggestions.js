import _ from 'lodash'
import products from './data/products.json'

export function getTagSuggestions(productName) {
  const matchingProducts = _.filter(products, product => {
    return product.name.toLowerCase().includes(productName.toLowerCase())
  })

  // We could sort the tags based on the occurance, but for now we'll just use the first
  // matching ones
  const tags = _.uniq(_.flatten(_.map(matchingProducts, product => product.tags.split(' '))))

  return _.take(tags, 3)
}
