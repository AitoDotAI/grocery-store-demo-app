import _ from 'lodash'
import products from './data/products.json'

// Simple string based search from products
export function getProductSearchResults(userId, inputValue) {
  // We could search from user's purchase history, but it was omitted in this demo
  if (!inputValue) {
    return []
  }

  const filteredProducts = _.filter(products, product => {
    return product.name.toLowerCase().includes(inputValue.toLowerCase())
  })

  return _.take(filteredProducts, 5)
}
