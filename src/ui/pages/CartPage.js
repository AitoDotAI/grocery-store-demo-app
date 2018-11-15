import React, { Component } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { FaChevronLeft } from 'react-icons/fa'
import Cart from '../components/Cart'

import './CartPage.css'

class CartPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false,
    }
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    })
  }

  onBackClick = (e) => {
    e.preventDefault()

    this.props.actions.setPage('/')
  }

  render() {
    const { cart } = this.props.appState

    return (
      <div className="CartPage">
        <a className="CartPage__back-link" href="/" onClick={this.onBackClick}>
          <FaChevronLeft />
          Back to products
        </a>

        <Cart actions={this.props.actions} cart={cart} />

        <Button onClick={this.toggleModal} disabled={cart.length === 0} color="primary">Purchase</Button>

        <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>This is a demo</ModalHeader>
          <ModalBody>
            The purchase isn't really happening, since it's is out of the demo's scope.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModal}>Ok</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default CartPage
