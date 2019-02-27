import React, { useState, useContext } from 'react'
import { FirebaseContext } from '../Firebase'
import { withRouter } from 'react-router-dom'
import { SignUpLink } from '../SignUp'
import * as ROUTES from '../../constants/routes'

const SignInPage = ({ history }) => (
  <div>
    <h1>Sign In</h1>
    <SignInForm history={history} />
    <SignUpLink />
  </div>
)

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
}

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

export default withRouter(SignInPage)

export { SignInForm }
