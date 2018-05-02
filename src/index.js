import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import Formed from './Formed'
class App extends Component {
  onSubmit = (values, injectErrors) =>
    setTimeout(() => {
      injectErrors({ password: 'wrong' })
    }, 2000)

  render() {
    return (
      <div>
        <Formed
          fields={{
            pseudo: {
              validators: [
                [x => x.length >= 3, 'Pseudo need to be more than 3'],
                [x => x.length <= 5, 'Pseudo need to be  less 5']
              ]
            },
            password: {
              validators: [
                [x => x.length >= 3, 'Password need to be more than 3']
              ]
            }
          }}
          submit={this.onSubmit}
        />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#app'))
