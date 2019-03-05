import React, { Component } from 'react'
import _ from 'lodash'
import { Input } from 'reactstrap'

import './TagsInput.css'

class TagsInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tagsInputValue: '',
      suggestions: []
    }
  }

  onProductNameChange = (e) => {
    const val = e.target.value

    this.setState({
      productNameInputValue: val,
    })

    if (!val) {
      this.setState({ tagSuggestions: null })
    } else {
      this.debouncedFetchNewSuggestions(val)
    }
  }

  render() {
    return (
      <div className="TagsInput">
        <ul>
          {_.map(this.state.suggestions, (suggestion, index) => {
            return <li key={index}>{suggestion}</li>
          })}
        </ul>

        <Input
          value={this.state.tagsInputValue}
          onChange={this.onInputChange}
          type="text"
          name="tags"
          id="tags"
          placeholder="Input tags or add suggestions above"
        />
      </div>
    )
  }
}

export default TagsInput
