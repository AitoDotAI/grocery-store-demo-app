import _ from 'lodash'
import products from './data/products.json'


export function getRecommendedProducts(userId, currentShoppingBasket, count) {
  // Very simple, doesn't take user into account

  const notInBasket = _.filter(products, product => {
    const isInBasket = _.findIndex(currentShoppingBasket, item => item.id === product.id) !== -1
    return !isInBasket
  })

  return _.take(notInBasket, count)
}
