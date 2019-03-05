# Aito Grocery Store Demo App

* Simple version: https://aito-grocery-store-demo-app.netlify.com/
* Smarter version: https://aito-grocery-store-demo-app-smart.netlify.com/. Integrates to Aito and provides personalised features.

**Install**:

* Install https://nodejs.org/en/
* Then go to the project directory and run the following commands
* `npm install`
* `npm start`


## Background
This demo app has been created by Aito.ai for the purpose of showing features and functionalities of the [Aito.ai managed machine learning database](https://aito.ai).
The application was originally created for [Hacktalks Helsinki, on November the 22nd of November 2018](https://www.hacktalks.fi/). The app is for demonstration purposes only, so many
special cases and error handling have been omitted in favour of readability and simplicity.

The software is licensed under the Apache 2 license, so it can be cloned and modified at will. It can therefore be used as a template Aito client application.
We accept pull requests in case you find something obvious missing or broken.

## The exercise
The application acts as a template for the Hacktalks workshop. The purpose is to have a _very simple_, yet somewhat useful application, which we make progressively smarter
by moving over the functionality to Aito. The aim is to show how easy it is to improve the application by using Aito.

### The data
For the scope of this exercise, there is only a limited data set with 42 products available. The low number of products is intentional to restrict the scope and
make the examples easy to understand. Applying machine learning to such a limited set of products comes with certain restrictions, and the results reflect these facts.

You can see the full product list via this link: https://github.com/AitoDotAI/grocery-store-demo-app/blob/master/src/data/products.json

The aim of this demo is not to show you how Aito is able to handle large datasets, but rather how a very basic grocery store app could be built and made intelligent by using Aito.

<br>

![Data setup diagram](./docs/aito-grocery-store.svg)

<br>

| Table  | Description | Number of entries |
| ------------- | ------------- |:------:|
| users  | All known users. Key users: `larry`, `veronica`, `alice` | 67 |
| products  | All the products sold in the store | 42 |
| userBehavior  | "Analytics" data with user actions in a given setting  | 3805 |
| decisions  | Individual decisions for products   | 63341 |


### Setting

The exercises are focusing on these features:

- Recommendations based on the users’ previous shopping behaviour
- Dynamic recommendations – Aito won’t show you any recommendations if the products are already in your shopping basket
- Smart search: Aito recognises the users’ dietary restrictions and preferences, and shows search results accordingly
   - E.g. when lactose-free Larry search for milk, only lactose-free options are shown

**Links:**

* [API Documentation](https://aito.ai/docs/api)


## Exercise 1: Smart search

* Open [src/01-search.js](src/01-search.js)
* Edit the code so that it executes an Aito query, below you can find a few examples

### 1st iteration

Query which does a simple text matching without personalisation.

```js
import axios from 'axios'

export function getProductSearchResults(userId, inputValue) {
  return axios.post('https://aito-grocery-store.api.aito.ai/api/v1/_search', {
    from: 'products',
    where: {
      $or: [
        { name: { $match: inputValue } },
        { tags: { $match: inputValue } }
      ]
    },
    limit: 5
  }, {
    headers: { 'x-api-key': 'FWuBYAfGzXa2a0FUreVPL6EqS01kbVnw9ABjJjSZ' },
  })
    .then(response => {
      return response.data.hits
    })
}
```

### 2nd iteration

Query which personalises the results based on the user's previous shopping behavior.

```js
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
```


## Exercise 2: Recommend products

* Open [src/02-recommend.js](src/02-recommend.js)
* Edit the code so that it executes an Aito query, below you can find a few examples

### 1st iteration

This query returns products which are not in the current shopping basket, but the
results are not personalised for a single user. The returned products would be
the most popular products across users.

```js
import axios from 'axios'

export function getRecommendedProducts(userId, currentShoppingBasket, count) {
  return axios.post('https://aito-grocery-store.api.aito.ai/api/v1/_recommend', {
    from: 'decisions',
    where: {
      'product.id': {
        $and: currentShoppingBasket.map(item => ({ $not: item.id })),
      }
    },
    recommend: 'product',
    goal: { 'purchase': true },
    limit: count
  }, {
    headers: { 'x-api-key': 'FWuBYAfGzXa2a0FUreVPL6EqS01kbVnw9ABjJjSZ' },
  })
    .then(result => {
      return result.data.hits
    })
}
```

### 2nd iteration

We simply add `'behavior.user': String(userId)` filter in the query, to get
personalised results.

```js
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
```


## Exercise 3: Get tag suggestions

* Open [src/03-get-tag-suggestions.js](src/03-get-tag-suggestions.js)
* Edit the code so that it executes an Aito query, below you can find a few examples

### 1st iteration

Query which predicts the most likely tags for a given product name.

```js
import axios from 'axios'

export function getTagSuggestions(productName) {
  return axios.post('https://aito-grocery-store.api.aito.ai/api/v1/_predict', {
    from: 'products',
    where: {
      name: productName
    },
    predict: 'tags',
    exclusiveness: false,
    limit: 3
  }, {
    headers: { 'x-api-key': 'FWuBYAfGzXa2a0FUreVPL6EqS01kbVnw9ABjJjSZ' },
  })
    .then(response => {
      return response.data.hits.map(hit => hit.feature)
    })
}
```

### 2nd iteration

This iteration can be useful in some cases. We add a filter for the probability,
to get only the tags we're most confident about.

```js
import axios from 'axios'

export function getTagSuggestions(productName) {
  return axios.post('https://aito-grocery-store.api.aito.ai/api/v1/_predict', {
    from: 'products',
    where: {
      name: productName
    },
    predict: 'tags',
    exclusiveness: false,
    limit: 10
  }, {
    headers: {
      'x-api-key': 'FWuBYAfGzXa2a0FUreVPL6EqS01kbVnw9ABjJjSZ'
    },
  })
    .then(response => {
      return response.data.hits
        .filter(e => e.$p > 0.5)  // Filter out results which are not very strong
        .map(hit => hit.feature)
    })
}
```
