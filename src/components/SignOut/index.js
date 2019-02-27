import React, { useContext } from 'react'
import { FirebaseContext } from '../Firebase'

const SignOutButton = () => {
  const fireBase = useContext(FirebaseContext)

  return (
    <button type="button" onClick={fireBase.doSignOut}>
      Sign Out
    </button>
  )
}

export default SignOutButton
