import React, { useContext, useState, useEffect } from 'react'

import PasswordChangeForm from '../PasswordChange'
import { PasswordForGetForm } from '../PasswordForget'
import {
  withAuthorization,
  AuthUserContext,
  withEmailVerification,
} from '../Session'
import { FirebaseContext } from '../Firebase'

import { compose } from 'recompose'

const SIGN_IN_METHODS = [
  {
    id: 'password',
    provider: null,
  },
  {
    id: 'google.com',
    provider: 'googleProvider',
  },
  {
    id: 'facebook.com',
    provider: 'facebookProvider',
  },
]

const AccountPage = () => {
  const auth = useContext(AuthUserContext)
  return (
    <div>
      <h1>{auth.email}</h1>
      <PasswordForGetForm />
      <PasswordChangeForm />
      <LoginManageMent auth={auth} />
    </div>
  )
}

const LoginManageMent = ({ auth }) => {
  const [activeSignInMethods, setActiveSignInMethods] = useState([])
  const [error, setError] = useState(null)

  const firebase = useContext(FirebaseContext)
  console.log(auth)
  // Use effect
  useEffect(() => {
    fetchSignInMethods()
  }, [])

  const fetchSignInMethods = () => {
    firebase.auth
      .fetchSignInMethodsForEmail(auth.email)
      .then(activeSignInMethods => {
        setActiveSignInMethods(activeSignInMethods)
        setError(null)
      })
      .catch(error => setError(error))
  }

  const onSocialLoginLink = provider => {
    firebase.auth.currentUser
      .linkWithPopup(firebase[provider])
      .then(fetchSignInMethods)
      .catch(error => setError(error))
  }

  const onUnlink = providerId => {
    firebase.auth.currentUser
      .unlink(providerId)
      .then(fetchSignInMethods)
      .catch(error => setError(error))
  }

  const onDefaultLoginLink = password => {
    const credential = firebase.emailAuthProvider.credential(
      auth.email,
      password
    )

    firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(fetchSignInMethods)
      .catch(error => setError(error))
  }

  return (
    <div>
      Sign In Methods
      <ul>
        {SIGN_IN_METHODS.map(signInMethod => {
          const onlyOneLeft = activeSignInMethods.length === 1
          const isEnabled = activeSignInMethods.includes(signInMethod.id)
          return (
            <li key={signInMethod.id}>
              {signInMethod.id === 'password' ? (
                <DefaultLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onDefaultLoginLink}
                  onUnlink={onUnlink}
                />
              ) : (
                <SocialLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onSocialLoginLink}
                  onUnlink={onUnlink}
                />
              )}
            </li>
          )
        })}
      </ul>
      {error && <p>{error.message}</p>}
    </div>
  )
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) => {
  return isEnabled ? (
    <button
      type="button"
      onClick={() => {
        onUnlink(signInMethod.id)
      }}
      disabled={onlyOneLeft}>
      Deactive {signInMethod.id}
    </button>
  ) : (
    <button
      type="button"
      onClick={() => {
        onLink(signInMethod.provider)
      }}>
      Link {signInMethod.id}
    </button>
  )
}

const DefaultLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) => {
  const [formData, setFormData] = useState({ passwordOne: '', passwordTwo: '' })

  const { passwordOne, passwordTwo } = formData

  const onSubmit = e => {
    e.preventDefault()
    onLink(formData.passwordOne)
    setFormData({ passwordOne: '', passwordTwo: '' })
  }

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const isInvalid = passwordOne !== passwordTwo || passwordOne === ''

  return isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}>
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <form onSubmit={onSubmit}>
      <input
        type="password"
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        placeholder="New password"
      />
      <input
        type="password"
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        placeholder="New password"
      />
      <button type="submit" disabled={isInvalid}>
        {' '}
        Link {signInMethod.id}
      </button>
    </form>
  )
}

const codition = auth => !!auth

export default compose(
  withAuthorization(codition),
  withEmailVerification
)(AccountPage)
