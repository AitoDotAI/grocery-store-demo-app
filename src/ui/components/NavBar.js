import React, { Component } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import logoImage from '../assets/logo.svg'
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa'

import './NavBar.css'

// XXX: Hard-coded to UI-side
function getUserName(userId) {
  switch (userId) {
    case 'veronica':
      return 'Vegetarian Veronica'
    case 'larry':
      return 'Lactose-free Larry'
    case 'alice':
      return 'All-goes Alice'
    default:
      throw new Error(`Unknown user id: ${userId}`)
  }
}

class NavBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdownOpen: false,
    }
  }

  toggle = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }

  onUserSelected = (userId) => {
    this.props.onUserSelected(userId)
    this.props.actions.setPage('/')
  }

  render() {
    const { props } = this

    return (
      <nav className="NavBar">
        <img
          className="NavBar__logo"
          src={logoImage}
          alt=""
          onClick={() => props.actions.setPage('/')}
        />

        <ol className="NavBar__links">
          <li className="NavBar__cart-link" onClick={() => props.actions.setPage('/cart')}>
            <FaShoppingCart />
            <span className="NavBar__cart-link-text">
              {props.cart.length}
              {' '}
              ITEMS
            </span>
          </li>

          <li className="NavBar__profile-link">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle tag="a">
                <FaUserCircle />
                <span className="NavBar__profile-link-name">
                  {getUserName(this.props.selectedUserId).split(' ')[1]}
                </span>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => this.onUserSelected('larry')}>{getUserName('larry')}</DropdownItem>
                <DropdownItem onClick={() => this.onUserSelected('veronica')}>{getUserName('veronica')}</DropdownItem>
                <DropdownItem onClick={() => this.onUserSelected('alice')}>{getUserName('alice')}</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => props.actions.setPage('/admin')}>Admin view</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
        </ol>
      </nav>
    )
  }
}

export default NavBar
