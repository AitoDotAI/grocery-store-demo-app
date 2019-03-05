import React, { Component } from 'react'
import _ from 'lodash'
import ProductList from './ProductList'

import './RecommendedProducts.css'

const RECOMMENDED_ITEMS_COUNT = 5

class RecommendedProducts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      recommendedProducts: [],
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedUserId !== prevProps.selectedUserId) {
      this.setState({
        recommendedProducts: []
      })

      this.fetchNewRecommendedProducts(this.props.cart, RECOMMENDED_ITEMS_COUNT)
    }
  }

  componentDidMount() {
    this.fetchNewRecommendedProducts(this.props.cart, RECOMMENDED_ITEMS_COUNT)
  }

  fetchNewRecommendedProducts = (avoidItems, count) => {
    this.props.dataFetchers.getRecommendedProducts(avoidItems, count)
      .then(products => _.map(products, (item) => {
        const reactId = _.uniqueId(item.id)
        return _.merge({}, item, { reactId })
      }))
      .then(products => this.setState({
        recommendedProducts: this.state.recommendedProducts.concat(products),
      }))
      .catch(err => this.props.actions.showError(err))
  }

  onItemAddedToCart = (itemIndex) => {
    const { recommendedProducts } = this.state
    const product = recommendedProducts[itemIndex]

    this.setState({
      recommendedProducts: _.filter(recommendedProducts, p => p.id !== product.id),
    })

    const avoidItems = this.props.cart.concat(recommendedProducts).concat([product])
    this.props.actions.addItemToCart(product, () => {
      setTimeout(
        () => this.fetchNewRecommendedProducts(avoidItems, RECOMMENDED_ITEMS_COUNT - this.state.recommendedProducts.length),
        500
      )
    })
  }

  onItemRemovedFromCart = (itemIndex) => {
    const product = this.state.recommendedProducts[itemIndex]
    this.props.actions.removeItemFromCart(product.id)
  }

  render() {
    const { state, props } = this

    return (
      <div className="RecommendedProducts">
        <h4>Recommended products</h4>

        <ProductList
          currentCart={props.cart}
          emptyText="No more recommendations found"
          items={state.recommendedProducts}
          onItemAddedToCart={this.onItemAddedToCart}
          onItemRemovedFromCart={this.onItemRemovedFromCart}
        />
      </div>
    )
  }
}

export default RecommendedProducts
