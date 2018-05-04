import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import Formed from './Formed'

const pipe = (initAcc, ...fns) => fns.reduce((acc, f) => f(acc), initAcc)
const toNameKeyObj = arrayOfObjWithNameKey =>
  arrayOfObjWithNameKey.reduce((acc, obj) => {
    acc[obj.name] = obj.name
    return acc
  }, {})

const mapFieldsNameToDefs = fieldsDefs => fieldsNameArr =>
  fieldsNameArr.map(name => fieldsDefs.find(fieldObj => fieldObj.name === name))

const formalize = fieldsDefinitions => (
  components = {
    Input: p => <input {...p} />,
    Form: p => <form {...p} />,
    Label: p => <label {...p} />,
    ErrorMessage: p => <span {...p} />,
    Button: p => <button {...p}>Submit</button>
  }
) => ({ pickFields, ...props }) => (
  <Formed
    {...props}
    components={components}
    fields={pipe(
      fieldsDefinitions,
      toNameKeyObj,
      pickFields,
      mapFieldsNameToDefs(fieldsDefinitions)
    )}
  />
)

const Formalized = formalize([
  {
    name: 'email',
    validators: [
      [({ email }) => email.length >= 3, 'email need to be more than 3'],
      [({ email }) => email.length <= 5, 'email need to be less than 5']
    ]
  },
  {
    name: 'password',
    validators: [[({ password }) => password.length >= 3, 'Password need to be more than 3']]
  }
])()

class App extends Component {
  onSubmit = (values, injectErrors) =>
    setTimeout(() => {
      injectErrors({ password: 'wrong' })
    }, 2000)

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

ReactDOM.render(<App />, document.querySelector('#app'))
