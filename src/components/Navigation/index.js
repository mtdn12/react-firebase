import React, { useContext } from 'react'
import { AuthUserContext } from '../Session'
import { Link } from 'react-router-dom'
import SignOutButton from '../SignOut'
import * as ROUTES from '../../constants/routes'

const Navigation = () => {
  const authUser = useContext(AuthUserContext)
  console.log(authUser)
  return authUser ? <NavigationAuth /> : <NavigationNonAuth />
}

const NavigationAuth = () => (
  <div>
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Lading</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>
      <li>
        <SignOutButton />
      </li>
    </ul>
  </div>
)

const NavigationNonAuth = () => (
  <div>
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Lading</Link>
      </li>

      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
    </ul>
  </div>
)

export default Navigation
