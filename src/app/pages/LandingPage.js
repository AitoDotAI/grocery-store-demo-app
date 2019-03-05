import React, { Component } from 'react'
import ProductSearch from '../components/ProductSearch'
import RecommendedProducts from '../components/RecommendedProducts'

import './LandingPage.css'

class LandingPage extends Component {
  render() {
    return (
      <div className="LandingPage">
        <ProductSearch
          selectedUserId={this.props.selectedUserId}
          cart={this.props.appState.cart}
          actions={this.props.actions}
          dataFetchers={this.props.dataFetchers}
        />

        <RecommendedProducts
          selectedUserId={this.props.selectedUserId}
          cart={this.props.appState.cart}
          actions={this.props.actions}
          dataFetchers={this.props.dataFetchers}
        />
      </div>
    )
  }
}

export default LandingPage
