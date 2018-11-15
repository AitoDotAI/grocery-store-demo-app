import React, { Component } from 'react'
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import _ from 'lodash'
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa'
import ProductListItem from './ProductListItem'

import './ProductList.css'

class ProductList extends Component {
  render() {
    const { props } = this

    const items = _.map(props.items, item => {
      const isItemInCart = _.findIndex(props.currentCart, cartItem => cartItem.id === item.id) !== -1
      const actionElement = isItemInCart ? <FaTrashAlt /> : <FaPlusCircle />
      const onActionClick = isItemInCart ? props.onItemRemovedFromCart : props.onItemAddedToCart
      const color = isItemInCart ? 'red' : 'green'
      return _.merge({}, item, { actionElement, onActionClick, color })
    })

    return (
      <ol className="ProductList">
        {
          items.length === 0 ? <span className="ProductList__empty">{this.props.emptyText}</span> : (
            <TransitionGroup>
              {
                items.map((item, index) => {
                  return (
                    <CSSTransition classNames="fade" timeout={{ enter: 250, exit: 300 }} key={item.reactId || item.id}>
                      <ProductListItem
                        color={item.color}
                        item={item}
                        actionElement={item.actionElement}
                        onActionClick={() => item.onActionClick(index)}
                      />
                    </CSSTransition>
                  )
                })
              }
            </TransitionGroup>
          )
        }
      </ol>
    )
  }
}

export default ProductList
