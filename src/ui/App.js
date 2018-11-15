import React, { Component } from 'react'
import _ from 'lodash'
import {
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import { createBrowserHistory } from 'history';
import * as data from './data'
import NavBar from './components/NavBar'
import LandingPage from './pages/LandingPage'
import AdminPage from './pages/AdminPage'
import CartPage from './pages/CartPage'
import DataInspectPage from './pages/DataInspectPage'

import './App.css'

const history = createBrowserHistory();

function getPath(pathname) {
  return _.trimEnd(pathname, '/')
}
class App extends Component {
  constructor() {
    super()

    this.state = {
      cart: [],
      selectedUserId: 'larry',
      showError: null,
      urlPath: getPath(window.location.pathname),
    }
  }

  componentDidMount() {
    // Listen for changes to the current location.
    history.listen((location, action) => {
      window.scrollTo(0, 0);

      const urlPath = getPath(location.pathname)
      this.setState({
        urlPath,
      })
    })
  }

  addItemToCart = (product, cb) => {
    const { state } = this
    const newCart = state.cart.concat([product])
    this.setState({
      cart: _.uniqBy(newCart, item => item.id),
    }, cb)
  }

  removeItemFromCart = (productId, cb) => {
    const { state } = this
    this.setState({
      cart: _.filter(state.cart, item => item.id !== productId),
    }, cb)
  }

  setPage(urlPath) {
    history.push(urlPath)
  }

  getPage(urlPath) {
    switch (urlPath) {
      case '/cart':
        return CartPage
      case '/admin':
        return AdminPage
      case '/data':
        return DataInspectPage
      case '/':
      default:
        return LandingPage
    }
  }

  showError = (err) => {
    this.setState({ showError: err })
  }

  onUserSelected = (userId) => {
    this.setState({ selectedUserId: userId, cart: [] })
  }

  render() {
    const { state } = this
    const Page = this.getPage(state.urlPath)

    const dataFetchers = {
      getTagSuggestions: (productName) => Promise.resolve(data.getTagSuggestions(productName)),

      // Add user behavior
      getRecommendedProducts:
        (currentShoppingBasket, count) => Promise.resolve(
          data.getRecommendedProducts(state.selectedUserId, currentShoppingBasket, count)
        ),

      getProductSearchResults:
        (searchValue) => Promise.resolve(
          data.getProductSearchResults(state.selectedUserId, searchValue)
        ),
    }

    const actions = {
      goBack: history.goBack,
      setPage: this.setPage,
      addItemToCart: this.addItemToCart,
      removeItemFromCart: this.removeItemFromCart,
      showError: this.showError,
    }

    const modalOpen = state.showError !== null
    return (
      <div className="App">
        <NavBar
          cart={state.cart}
          selectedUserId={state.selectedUserId}
          onUserSelected={this.onUserSelected}
          actions={actions}
          state={state}
        />

        <div className="App__page">
          <Page
            selectedUserId={state.selectedUserId}
            actions={actions}
            dataFetchers={dataFetchers}
            appState={state}
          />
        </div>

        <Modal color="danger" isOpen={modalOpen} toggle={() => this.showError(null)}>
          <ModalHeader toggle={() => this.showError(null)}>Error</ModalHeader>
          <ModalBody>
            {_.get(this.state.showError, 'message')}
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default App
