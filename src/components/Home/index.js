import React from 'react'
import { compose } from 'recompose'

import { withAuthorization, withEmailVerification } from '../Session'

const HomePage = () => {
  return (
    <div>
      <h1>Home page</h1>
      <p>The home page is accessible by every signed in user</p>
    </div>
  )
}

const condition = authUser => !!authUser

export default compose(
  withAuthorization(condition),
  withEmailVerification
)(HomePage)
