import React, { Component } from 'react'
import _ from 'lodash'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'

import './AdminPage.css'

class AdminPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false,
      tagsInputValue: '',
      productNameInputValue: '',
      tagSuggestions: []
    }

    this.debouncedFetchNewSuggestions = _.debounce(this.fetchNewSuggestions, 300).bind(this)
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    })
  }

  onProductNameChange = (e) => {
    const val = e.target.value

    this.setState({
      productNameInputValue: val,
    })

    if (!val) {
      this.setState({ tagSuggestions: [] })
    } else {
      this.debouncedFetchNewSuggestions(val)
    }
  }

  onTagsInputChange = (e) => {
    this.setState({
      tagsInputValue: e.target.value,
    })
  }

  onTagClick = (index) => {
    const tag = this.state.tagSuggestions[index]

    this.setState({
      tagsInputValue: `${this.state.tagsInputValue} ${tag}`
    })
  }

  fetchNewSuggestions(productName) {
    return this.props.dataFetchers.getTagSuggestions(productName)
      .then(tagSuggestions => this.setState({ tagSuggestions }))
      .catch(err => this.props.actions.showError(err))
  }

  render() {
    return (
      <div className="AdminPage">
        <h3>Add new product</h3>

        <Form>
          <FormGroup>
            <Label for="productName">Product name</Label>
            <Input
              value={this.state.productNameInputValue}
              onChange={this.onProductNameChange}
              type="text"
              name="productName"
              id="productName"
              placeholder="Product name"
            />
          </FormGroup>

          <FormGroup>
            <Label for="tags">Tags</Label>
            <div className="TagsInput">
              <ul>
                {_.map(this.state.tagSuggestions, (suggestion, index) => {
                  return <li onClick={() => this.onTagClick(index)} key={index}>{suggestion}</li>
                })}
              </ul>

              <Input
                value={this.state.tagsInputValue}
                onChange={this.onTagsInputChange}
                type="text"
                name="tags"
                id="tags"
                placeholder="Input tags or add suggestions above"
              />
            </div>
          </FormGroup>

          <Button onClick={this.toggleModal} color="primary">Add product</Button>
        </Form>

        <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>This is a demo</ModalHeader>
          <ModalBody>
            Product was not really added anywhere, since this is out of the demo's scope.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModal}>Ok</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default AdminPage
