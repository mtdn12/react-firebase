import React, { useContext, useState, useEffect } from 'react'
import { FirebaseContext } from '../Firebase'
import * as ROLES from '../../constants/roles'
import { withAuthorization, withEmailVerification } from '../Session'
import { compose } from 'recompose'
import { Switch, Route, Link } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'

const UserList = () => {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  // get firebase from context
  const firebase = useContext(FirebaseContext)
  // User effect
  useEffect(() => {
    setLoading(true)
    firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val()
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }))
      setLoading(false)
      setUsers(usersList)
    })
    return () => {
      firebase.users().off()
    }
  }, [])
  return (
    <div>
      <h2>Users</h2>
      {loading && <div>Loading...</div>}
      <ul>
        {users.map(user => (
          <li key={user.uid}>
            <span>
              <strong>ID: </strong>
              {user.uid}
            </span>
            <span>
              <strong>E-MAIL: </strong>
              {user.email}
            </span>
            <span>
              <strong>Username: </strong>
              {user.username}
            </span>
            <span>
              <Link
                to={{
                  pathname: `${ROUTES.ADMIN}/${user.uid}`,
                  state: { user },
                }}>
                Details
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const UserItem = ({ match, location }) => {
  console.log(match)
  console.log(location)
  const [user, setUser] = useState(location.state)
  const [loading, setLoading] = useState(false)
  const firebase = useContext(FirebaseContext)

  const onSendPasswordResetEmail = () => {
    firebase.doPasswordReset(user.email)
  }

  useEffect(() => {
    if (user) return
    setLoading(true)
    firebase.user(match.params.id).on('value', snapshot => {
      setUser(snapshot.val())
      setLoading(false)
    })
    return () => {
      firebase.user(match.params.id).off()
    }
  }, [])

  return (
    <div>
      <h2>User ({match.params.id})</h2>
      {loading && <div>Loading...</div>}
      {user && (
        <div>
          <span>
            <strong>ID: </strong>
            {user.uid}
          </span>
          <span>
            <strong>E-Mail: </strong>
            {user.email}
          </span>
          <span>
            <strong>Username: </strong> {user.username}
          </span>
          <span>
            <button type="button" onClick={onSendPasswordResetEmail}>
              Send Password Reset
            </button>
          </span>
        </div>
      )}
    </div>
  )
}

const AdminPage = () => {
  return (
    <div>
      <h1>Admin page</h1>
      <p>The Admin Page is accessible by every signed in admin user</p>
      <Switch>
        <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
        <Route exact path={ROUTES.ADMIN} component={UserList} />
      </Switch>
    </div>
  )
}

const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN)

export default compose(
  withAuthorization(condition),
  withEmailVerification
)(AdminPage)
