import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import formalize from './formalize'

const Formalized = formalize([
  {
    name: 'email',
    validators: [
      ({ email }) => !(email.length >= 3) && 'email need to be more than 3',
      ({ email }) =>
        !(email.length <= 5) &&
        `email need to be less than 5, please erase ${email.length -
          5} characters`
    ]
  },
  {
    name: 'password',
    validators: [
      ({ password }) =>
        !(password.length >= 3) && 'Password need to be more than 3'
    ]
  }
])()

class CustomForm extends Component {
  onSubmit = values => console.log(values)

  render() {
    return (
      <div>
        <Formalized
          pickFields={({ email, password }) => [password, email]}
          submit={this.onSubmit}
        />
      </div>
    )
  }
}

ReactDOM.render(<CustomForm />, document.querySelector('#app'))
