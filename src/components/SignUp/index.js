import React, { useState, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/roles'
import { FirebaseContext } from '../Firebase'

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
}

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential'

const ERROR_MSG_ACCOUNT_EXISTS = `
An account with an E-Mail address to this social account already exists. 
Try to login from this account instead and associate your social accounts
 on your personal account page.
`

const SignUpPage = ({ history }) => {
  return (
    <div>
      <h1>SignUp</h1>
      <SignUpForm history={history} />
    </div>
  )
}

function SignUpForm({ history }) {
  const [formData, setFormData] = useState(INITIAL_STATE)
  const firebase = useContext(FirebaseContext)

  const { username, email, passwordOne, passwordTwo, isAdmin, error } = formData

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleChangeCheckbox = e => {
    setFormData({ ...formData, [e.target.name]: e.target.checked })
  }
  // Submit form
  const onSubmit = e => {
    e.preventDefault()
    const roles = []
    if (isAdmin) {
      roles.push(ROLES.ADMIN)
    }

    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        return firebase.user(authUser.user.uid).set({ username, email, roles })
      })
      .then(() => {
        return firebase.doSendEmailVerification()
      })
      .then(() => {
        setFormData(INITIAL_STATE)
        history.push(ROUTES.HOME)
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS
        }
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
      <label htmlFor="">
        Admin :{' '}
        <input
          type="checkbox"
          name="isAdmin"
          checked={isAdmin}
          onChange={handleChangeCheckbox}
        />
      </label>
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
