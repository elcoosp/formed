import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class Formed extends Component {
  static propTypes = {
    submit: PropTypes.func.isRequired,
    components: PropTypes.shape({
      Input: PropTypes.func.isRequired,
      Form: PropTypes.func.isRequired,
      Label: PropTypes.func.isRequired,
      ErrorMessage: PropTypes.func.isRequired,
      Button: PropTypes.func.isRequired
    }).isRequired,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
        validators: PropTypes.arrayOf(PropTypes.func).isRequired
      })
    ).isRequired
  }

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

  validateField = (fieldName, inputValue) => {
    const { validators } = this.props.fields.filter(
      ({ name }) => name === fieldName
    )[0]
    for (const getValidationMessage of validators) {
      //Pass the wole state values and the last inputValue to the validator function
      const message = getValidationMessage({
        ...this.state.values,
        [fieldName]: inputValue
      })
      if (message) {
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

  handleSubmit = e => {
    e.preventDefault()
    if (this.validateAllFields()) this.props.submit(this.state.values)
    // Reveal errors if none were shown
    else if (this.state.blurredFields.length === 0) {
      Object.keys(this.state.values).forEach(this.addBlurredField)
    }
  }

  isSubmitDisabled = () =>
    Object.entries(this.state.errors).some(([key, val]) => val.length > 0)

  addBlurredField = name =>
    this.setState(({ blurredFields }) => ({
      blurredFields: [...blurredFields, name]
    }))

  onBlur = ({ target: { name } }) => {
    if (!this.state.blurredFields.includes(name)) this.addBlurredField(name)
  }

  render() {
    const { Input, Label, Form, ErrorMessage, Button } = this.props.components
    const { errors, blurredFields, values } = this.state
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.props.fields.map(({ name, type = 'text' }) => (
          <Fragment key={name}>
            <Label htmlFor={name}>{name}</Label>
            <Input
              onBlur={this.onBlur}
              type={type}
              onChange={this.onValueChange}
              value={values[name]}
              name={name}
            />
            {errors[name] &&
              blurredFields.includes(name) && (
                <ErrorMessage>{errors[name]}</ErrorMessage>
              )}
          </Fragment>
        ))}
        <Button type="submit" disabled={this.isSubmitDisabled()} />
      </Form>
    )
  }
}
