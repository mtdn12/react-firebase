import React, { useContext, useState } from 'react'
import { FirebaseContext } from '../Firebase'
import { Link } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'

const PasswordForgetPage = () => {
  console.log('render me please')
  return (
    <div>
      <h1>Password forgot</h1>
      <PasswordForGetForm />
    </div>
  )
}

const INITIAL_STATE = {
  email: '',
  error: null,
}

const PasswordForGetForm = () => {
  const [formData, setFormData] = useState(INITIAL_STATE)
  const fireBase = useContext(FirebaseContext)

  const { email, error } = formData
  // Handle submit form
  const onSubmit = e => {
    e.preventDefault()
    fireBase
      .doPasswordReset(email)
      .then(() => setFormData(INITIAL_STATE))
      .catch(error => setFormData({ ...formData, error }))
  }
  // handle input change
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const isInvalid = email.trim() === ''

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="email"
        value={email}
        onChange={onChange}
        placeholder="Input your email"
      />
      <button type="submit" disabled={isInvalid}>
        Reset My Password
      </button>
      {error && <p>{error.message}</p>}
    </form>
  )
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
)

export default PasswordForgetPage

export { PasswordForGetForm, PasswordForgetLink }
