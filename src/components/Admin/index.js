import React, { useContext, useState, useEffect } from 'react'
import { FirebaseContext } from '../Firebase'
import * as ROLES from '../../constants/roles'
import { withAuthorization, withEmailVerification } from '../Session'
import { compose } from 'recompose'

const AdminPage = () => {
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
      <h1>Admin page</h1>
      {loading && <div>Loading...</div>}
      <UserList users={users} />
    </div>
  )
}

const UserList = ({ users }) => {
  return (
    <div>
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
          </li>
        ))}
      </ul>
    </div>
  )
}

const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN)

export default compose(
  withAuthorization(condition),
  withEmailVerification
)(AdminPage)
