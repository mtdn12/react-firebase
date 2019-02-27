import React, { useContext, useState } from 'react'
import { FirebaseContext } from '../Firebase'

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
}

const PasswordChangeForm = () => {
  const [formData, setFormData] = useState(INITIAL_STATE)

  const firebase = useContext(FirebaseContext)

  const { passwordOne, passwordTwo, error } = formData

  // Hanlde submit
  const onSubmit = e => {
    e.preventDefault()
    firebase
      .doPasswordUpdate(passwordOne)
      .then(() => setFormData(INITIAL_STATE))
      .catch(error => setFormData({ ...formData, error }))
  }
  // Handle change
  const onChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const isInvalid =
    passwordOne === '' || passwordTwo === '' || passwordOne !== passwordTwo

  return (
    <form onSubmit={onSubmit}>
      <input
        type="password"
        name="passwordOne"
        value={passwordOne}
        placeholder="New password"
        onChange={onChange}
      />
      <input
        type="password"
        name="passwordTwo"
        value={passwordTwo}
        placeholder="Confrim new password"
        onChange={onChange}
      />
      <button type="submit" disabled={isInvalid}>
        Reset My Password
      </button>
      {error && <p>{error.message}</p>}
    </form>
  )
}

export default PasswordChangeForm
