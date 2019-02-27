import React, { useState, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import { FirebaseContext } from '../Firebase'

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
}

const SignUpPage = ({ history }) => {
  return (
    <div>
      <h1>SignUp</h1>
      <SignUpForm history />
    </div>
  )
}

function SignUpForm({ history }) {
  const [formData, setFormData] = useState(INITIAL_STATE)
  const firebase = useContext(FirebaseContext)

  const { username, email, passwordOne, passwordTwo, error } = formData

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  // Submit form
  const onSubmit = e => {
    e.preventDefault()
    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        setFormData(INITIAL_STATE)
        history.push(ROUTES.HOME)
      })
      .catch(error => {
        setFormData({ ...formData, error })
      })
  }
  return (
    <form onSubmit={onSubmit}>
      <input
        name="username"
        value={username}
        onChange={handleChange}
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={handleChange}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={handleChange}
        type="password"
        placeholder="Confirm Password"
      />
      <button type="submit">Sign Up</button>
      {error && <p>{error.message}</p>}
    </form>
  )
}

const SignUpLink = () => {
  return (
    <p>
      Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>{' '}
    </p>
  )
}

export default withRouter(SignUpPage)

export { SignUpForm, SignUpLink }
