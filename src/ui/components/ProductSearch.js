import React, { Component } from 'react'
import _ from 'lodash'
import ProductList from './ProductList'

import './ProductSearch.css'

class ProductSearch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inputValue: '',
      searchResults: null,
    }

    this.debouncedGetSearchResults = _.debounce(this.getSearchResults, 300).bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedUserId !== prevProps.selectedUserId) {
      this.setState({
        searchResults: null
      })

      this.getSearchResults(this.state.inputValue)
    }
  }

  onInputChange = (e) => {
    const inputVal = e.target.value
    this.setState({ inputValue: inputVal })

    if (!inputVal) {
      this.setState({ searchResults: null })
    } else {
      this.debouncedGetSearchResults(e.target.value)
    }
  }

  getSearchResults = (inputVal) => {
    if (!inputVal) {
      this.setState({
        searchResults: null
      })

      return
    }

    return this.props.dataFetchers.getProductSearchResults(inputVal)
      .then(searchResults => this.setState({ searchResults }))
      .catch(err => this.props.actions.showError(err))
  }

  onItemAddedToCart = (itemIndex) => {
    const { searchResults } = this.state
    const product = searchResults[itemIndex]

    this.props.actions.addItemToCart(product)
  }

  onItemRemovedFromCart = (itemIndex) => {
    const product = this.state.searchResults[itemIndex]
    this.props.actions.removeItemFromCart(product.id)
  }

  render() {
    const { state, props } = this

    return (
      <div className="ProductSearch">
        <input
          className="ProductSearch__input"
          type="search"
          placeholder="Search products"
          value={state.inputValue}
          onChange={this.onInputChange}
          onKeyPress={this.handleKeyPress}
        />

        {
          state.searchResults !== null
            ? (
              <ProductList
                currentCart={props.cart}
                emptyText="No products found"
                items={state.searchResults}
                onItemAddedToCart={this.onItemAddedToCart}
                onItemRemovedFromCart={this.onItemRemovedFromCart}
              />
            ) : (
              null
            )
        }
      </div>
    )
  }
}

export default ProductSearch
