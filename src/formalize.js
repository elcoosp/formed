import Formed from './Formed'
import React from 'react'

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

export default formalize
