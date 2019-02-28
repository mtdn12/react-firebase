import React, { useState, useContext } from 'react'
import { FirebaseContext } from '../Firebase'
import { withRouter } from 'react-router-dom'
import { SignUpLink } from '../SignUp'
import * as ROUTES from '../../constants/routes'
import { PasswordForgetLink } from '../PasswordForget'

const SignInPage = ({ history }) => (
  <div>
    <h1>Sign In</h1>
    <SignInForm history={history} />
    <SignInGoogle history={history} />
    <SignInFacebook history={history} />
    <SignUpLink />
    <PasswordForgetLink />
  </div>
)

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
}

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential'

const ERROR_MSG_ACCOUNT_EXISTS = `
An account with an E-Mail address to this social account already exists. 
Try to login from this account instead and associate your social accounts
 on your personal account page.
`

const SignInForm = ({ history }) => {
  const [formData, setFormData] = useState(INITIAL_STATE)
  const firebase = useContext(FirebaseContext)

  const { email, password, error } = formData

  // Submit handle
  const onSubmit = e => {
    e.preventDefault()
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setFormData(INITIAL_STATE)
        history.push(ROUTES.HOME)
      })
      .catch(error => {
        console.log(error)
        setFormData({ ...formData, error })
      })
  }

  // Handle change input
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const isInValid = password === '' || email === ''
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="email"
        value={email}
        onChange={onChange}
        placeholder="Email address"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        placeholder="Passwrod"
      />
      <button type="submit" disabled={isInValid}>
        SignIn
      </button>
      {error && <p>{error.message}</p>}
    </form>
  )
}

const SignInGoogle = ({ history }) => {
  const [error, setError] = useState(null)

  const firebase = useContext(FirebaseContext)
  const onSubmit = e => {
    e.preventDefault()
    firebase
      .doSignInWithGoogle()
      .then(socialAuth => {
        // Create a user in your firebase realtime database too
        console.log(socialAuth)
        return firebase.user(socialAuth.user.uid).set({
          username: socialAuth.user.displayName,
          email: socialAuth.user.email,
          roles: [],
        })
      })
      .then(() => {
        setError(null)
        history.push(ROUTES.HOME)
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS
        }
        setError(error)
      })
  }

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign in With Google</button>
      {error && <p>{error.message}</p>}
    </form>
  )
}

const SignInFacebook = ({ history }) => {
  const [error, setError] = useState(null)

  const firebase = useContext(FirebaseContext)
  const onSubmit = e => {
    e.preventDefault()
    firebase
      .doSignInWithGoogle()
      .then(socialAuth => {
        // Create a user in your firebase realtime database too
        return firebase.user(socialAuth.user.uid).set({
          username: socialAuth.additionalUserInfo.profile.name,
          email: socialAuth.additionalUserInfo.profile.email,
          roles: [],
        })
      })
      .then(() => {
        setError(null)
        history.push(ROUTES.HOME)
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS
        }
        setError(error)
      })
  }

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign in With Facebook</button>
      {error && <p>{error.message}</p>}
    </form>
  )
}

export default withRouter(SignInPage)

export { SignInForm }
