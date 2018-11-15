import axios from 'axios'

export function getProductSearchResults(userId, inputValue) {
  return axios.post('https://aito-grocery-store.api.aito.ai/api/v1/_recommend', {
    from: 'decisions',
    where: {
      'product.name': { "$match": inputValue },
      'behavior.user': userId
    },
    recommend: 'product',
    goal: { 'purchase': true },
    limit: 5
  }, {
    headers: { 'x-api-key': 'FWuBYAfGzXa2a0FUreVPL6EqS01kbVnw9ABjJjSZ' },
  })
    .then(response => {
      return response.data.hits
    })
}