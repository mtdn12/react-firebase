import React, { useContext } from 'react'

import PasswordChangeForm from '../PasswordChange'
import { PasswordForGetForm } from '../PasswordForget'
import { withAuthorization, AuthUserContext } from '../Session'

const AccountPage = () => {
  const auth = useContext(AuthUserContext)
  console.log(auth)
  return (
    <div>
      <h1>{auth.email}</h1>
      <PasswordForGetForm />
      <PasswordChangeForm />
    </div>
  )
}

const codition = auth => !!auth

export default withAuthorization(codition)(AccountPage)
