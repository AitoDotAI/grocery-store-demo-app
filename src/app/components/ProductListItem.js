import React, { Component } from 'react'

import './ProductListItem.css'

class ProductListItem extends Component {
  render() {
    const { item } = this.props
    const imageUrl = `https://public.keskofiles.com/f/k-ruoka/product/${item.id}?w=95&h=95&fm=jpg&q=90&fit=fill&bg=ffffff&dpr=2`

    const actionClass = `ProductListItem__action ProductListItem__action--${this.props.color}`
    return (
      <div className="ProductListItem">
        <div className="ProductListItem__left">
          <img className="ProductListItem__image" src={imageUrl} alt="" />
          <span className="ProductListItem__name">{item.name}</span>
        </div>

        <button className={actionClass} href="#" onClick={this.props.onActionClick}>
          {this.props.actionElement}
        </button>
      </div>
    )
  }
}

export default ProductListItem
