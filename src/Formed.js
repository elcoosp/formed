import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'

const onObjEntries = chain => callback => o => Object.entries(o)[chain](callback)

const mapObj = o => fn => onObjEntries('map')(keyVal => fn(...keyVal))(o)

export default class Formed extends Component {
  state = Object.assign(
    { blurredFields: [] },
    this.props.fields.reduce(
      (acc, { name }) => ({
        values: { ...acc.values, [name]: '' },
        errors: { ...acc.errors, [name]: '' }
      }),
      {}
    )
  )

  onValueChange = ({ target: { value, name } }) => {
    this.validateField(name, value)
    this.setState(({ values }) => ({ values: { ...values, [name]: value } }))
  }

  setError = (fieldName, message) =>
    this.setState(({ errors }) => ({
      errors: { ...errors, [fieldName]: message }
    }))

  injectErrors = errors =>
    Object.entries(errors).forEach(([fieldName, message]) => this.setError(fieldName, message))

  validateField = (fieldName, inputValue) => {
    const { validators } = this.props.fields.filter(({ name }) => name === fieldName)[0]
    for (const [validatorFunc, message] of validators) {
      if (!validatorFunc(inputValue)) {
        this.setError(fieldName, message)
        return false
      } else this.setError(fieldName, '')
    }
    return true
  }

  validateAllFields = () => {
    this.props.fields.forEach(({ name }) => {
      if (!this.validateField(name, this.state.values[name])) return false
    })
    return true
  }

  onSubmit = e => {
    e.preventDefault()
    if (this.validateAllFields()) this.props.submit(this.state.values, this.injectErrors)
    // Reveal errors if none were shown
    else if (this.state.blurredFields.length === 0) {
      Object.keys(this.state.values).forEach(this.addBlurredField)
    }
  }

  isSubmitDisabled = () => Object.entries(this.state.errors).some(([key, val]) => val.length > 0)

  addBlurredField = name =>
    this.setState(({ blurredFields }) => ({
      blurredFields: [...blurredFields, name]
    }))

  onBlur = ({ target: { name } }) => {
    if (!this.state.blurredFields.includes(name)) this.addBlurredField(name)
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        {this.props.fields.map(({ name, type = 'text' }) => (
          <Fragment key={name}>
            <label htmlFor={name}>{name}</label>
            <input
              onBlur={this.onBlur}
              type={type}
              onChange={this.onValueChange}
              value={this.state.values[name]}
              name={name}
            />
            {this.state.errors[name] &&
              this.state.blurredFields.includes(name) && <span>{this.state.errors[name]}</span>}
          </Fragment>
        ))}
        <button type="submit" disabled={this.isSubmitDisabled()}>
          Submit
        </button>
      </form>
    )
  }
}
