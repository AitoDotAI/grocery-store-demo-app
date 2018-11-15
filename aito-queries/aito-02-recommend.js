import axios from 'axios'

export function getRecommendedProducts(userId, currentShoppingBasket, count) {
  return axios.post('https://aito-grocery-store.api.aito.ai/api/v1/_recommend', {
    from: 'decisions',
    where: {
      'behavior.user': String(userId),
      'product.id': {
        $and: currentShoppingBasket.map(item => ({ $not: item.id })),
      }
    },
    recommend: 'product',
    goal: { 'purchase': true },
    limit: count
  }, {
    headers: {
      'x-api-key': 'FWuBYAfGzXa2a0FUreVPL6EqS01kbVnw9ABjJjSZ'
    },
  })
    .then(result => {
      return result.data.hits
    })
}
