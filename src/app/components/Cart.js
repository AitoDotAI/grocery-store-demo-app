import React, { Component } from 'react'
import _ from 'lodash'
import { FaTrashAlt } from 'react-icons/fa'
import ProductList from './ProductList'

import './Cart.css'

class Cart extends Component {
  onItemRemovedFromCart = (itemIndex) => {
    const product = this.props.cart[itemIndex]
    this.props.actions.removeItemFromCart(product.id)
  }

  render() {
    const { props } = this

    const items = _.map(props.cart, item => _.merge({}, item, {
      actionElement: <FaTrashAlt />,
      onActionClick: this.onItemRemovedFromCart,
    }))

    return (
      <div className="Cart">
        <h4>Shopping cart</h4>

        <ProductList
          currentCart={props.cart}
          emptyText="No products in cart"
          items={items}
          onItemActionClick={this.onItemRemovedFromCart}
        />
      </div>
    )
  }
}

export default Cart
