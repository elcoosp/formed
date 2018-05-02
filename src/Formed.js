import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'

const onObjEntries = chain => callback => o =>
  Object.entries(o)[chain](callback)

const mapObj = o => fn => onObjEntries('map')(keyVal => fn(...keyVal))(o)

export default class Formed extends Component {
  state = Object.entries(this.props.fields).reduce((acc, [key]) => {
    return {
      blurredFields: [],
      ...acc,
      values: { ...acc.values, [key]: '' },
      errors: { ...acc.errors, [key]: '' }
    }
  }, {})

  onValueChange = ({ target: { value, name } }) => {
    this.validateField(name, value)
    this.setState(({ values }) => ({ values: { ...values, [name]: value } }))
  }

  setError = (fieldName, message) =>
    this.setState(({ errors }) => ({
      errors: { ...errors, [fieldName]: message }
    }))

  injectErrors = errors =>
    Object.entries(errors).forEach(([error, message]) =>
      this.setError(error, message)
    )

  validateField = (fieldName, value) => {
    let isValidOrNot = true
    const { validators } = this.props.fields[fieldName]

    if (validators.some(([validate]) => !validate(value))) {
      isValidOrNot = false
      validators.forEach(([validatorFunc, message]) => {
        if (!validatorFunc(value)) this.setError(fieldName, message)
      })
    } else this.setError(fieldName, '')

    return isValidOrNot
  }

  validateAllFields = () => {
    let isValidOrNot = true
    Object.entries(this.props.fields).forEach(([fieldName]) => {
      if (!this.validateField(fieldName, this.state.values[fieldName]))
        isValidOrNot = false
    })
    return isValidOrNot
  }

  onSubmit = e => {
    e.preventDefault()
    if (this.validateAllFields())
      this.props.submit(this.state.values, this.injectErrors)
  }
  onBlur = ({ target: { name } }) => {
    if (!this.state.blurredFields.includes(name)) {
      this.setState(({ blurredFields }) => ({
        blurredFields: [...blurredFields, name]
      }))
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        {mapObj(this.props.fields)((fieldName, field) => (
          <Fragment key={fieldName}>
            <label htmlFor={fieldName}>{fieldName}</label>
            <input
              onBlur={this.onBlur}
              type={field.type || 'text'}
              onChange={this.onValueChange}
              value={this.state.values[fieldName]}
              name={fieldName}
            />
            {this.state.errors[fieldName] &&
              this.state.blurredFields.includes(fieldName) && (
                <span>{this.state.errors[fieldName]}</span>
              )}
          </Fragment>
        ))}
        <button type="submit">Submit</button>
      </form>
    )
  }
}
