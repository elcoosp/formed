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

const formalize = fieldsDefinitions => ({ pickFields, ...props }) => (
  <Formed
    {...props}
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
    name: 'pseudo',
    validators: [
      [({ pseudo }) => pseudo.length >= 3, 'Pseudo need to be more than 3'],
      [({ pseudo }) => pseudo.length <= 5, 'Pseudo need to be less than 5']
    ]
  },
  {
    name: 'password',
    validators: [[({ password }) => password.length >= 3, 'Password need to be more than 3']]
  }
])

class App extends Component {
  onSubmit = (values, injectErrors) =>
    setTimeout(() => {
      injectErrors({ pseudo: 'wrong' })
    }, 2000)

  render() {
    return (
      <div>
        <Formalized pickFields={({ pseudo }) => [pseudo]} submit={this.onSubmit} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#app'))
