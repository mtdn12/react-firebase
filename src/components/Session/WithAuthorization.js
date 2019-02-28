import React, { useEffect, useContext } from 'react'
import { FirebaseContext } from '../Firebase'
import AuthUserContext from './context'
import * as ROUTES from '../../constants/routes'
import { withRouter } from 'react-router-dom'

const withAuthorization = condition => Component => {
  const WithAuthorization = props => {
    const firebase = useContext(FirebaseContext)
    const auth = useContext(AuthUserContext)
    useEffect(() => {
      const listener = firebase.onAuthUserListener(
        auth => {
          if (!condition(auth)) {
            props.history.push(ROUTES.SIGN_IN)
          }
        },
        () => {
          props.history.push(ROUTES.SIGN_IN)
        }
      )
      return () => listener()
    }, [])

    return condition(auth) ? <Component {...props} /> : null
  }
  return withRouter(WithAuthorization)
}

export default withAuthorization
