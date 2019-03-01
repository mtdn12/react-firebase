import React, { useContext, useEffect, useState } from 'react'
import { compose } from 'recompose'
import { FirebaseContext } from '../Firebase'
import {
  withAuthorization,
  withEmailVerification,
  AuthUserContext,
} from '../Session'

const HomePage = () => {
  const [users, setUsers] = useState([])
  const firebase = useContext(FirebaseContext)

  useEffect(() => {
    firebase.users().on('value', snapshot => {
      setUsers(snapshot.val())
    })
    return () => firebase.users().off()
  }, [])

  return (
    <div>
      <h1>Home page</h1>
      <p>The home page is accessible by every signed in user</p>
      <Messages users={users} />
    </div>
  )
}

const Messages = ({ users }) => {
  const [loading, setLoading] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [limit, setLimit] = useState(5)

  const firebase = useContext(FirebaseContext)
  const auth = useContext(AuthUserContext)
  // fetch list messages
  useEffect(() => {
    onListenForMessages()
  }, [limit])
  //
  const onListenForMessages = () => {
    setLoading(true)
    firebase
      .messages()
      .orderByChild('createdAt')
      .limitToLast(limit)
      .on('value', snapshot => {
        // Convert list messages from snapshot
        const messageObject = snapshot.val()
        if (messageObject) {
          const messageList = Object.keys(messageObject).map(key => ({
            ...messageObject[key],
            uid: key,
          }))
          setMessages(messageList)
          setLoading(false)
        } else {
          setMessages(null)
          setLoading(false)
        }
      })
    return () => {
      firebase.messages().off()
    }
  }
  const onNextPage = () => {
    setLimit(limit + 5)
  }
  // Create message
  const onCreateMessage = e => {
    e.preventDefault()
    firebase.messages().push({
      text,
      userId: auth.uid,
      createdAt: firebase.serverValue.TIMESTAMP,
    })
    setText('')
  }
  // Remove message
  const onRemoveMessage = uid => () => {
    firebase.message(uid).remove()
  }
  // Edit message
  const onEditMessage = (message, text) => {
    firebase.message(message.uid).set({
      ...message,
      text,
      editedAt: firebase.serverValue.TIMESTAMP,
    })
  }
  return (
    <div>
      {loading && <div>Loading...</div>}
      {messages ? (
        <div>
          <MessageList
            messages={messages.map(message => ({
              ...message,
              user: users ? users[message.userId] : { userId: message.userId },
            }))}
            onRemoveMessage={onRemoveMessage}
            onEditMessage={onEditMessage}
          />
          {!loading && (
            <button type="button" onClick={onNextPage}>
              More
            </button>
          )}
        </div>
      ) : (
        <div>There is no messages</div>
      )}
      <form onSubmit={onCreateMessage}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

const MessageList = ({ messages, onRemoveMessage, onEditMessage }) => {
  return (
    <div>
      <ul>
        {messages.map(message => (
          <MessageItem
            key={message.uid}
            message={message}
            onRemoveMessage={onRemoveMessage}
            onEditMessage={onEditMessage}
          />
        ))}
      </ul>
    </div>
  )
}

const MessageItem = ({ message, onRemoveMessage, onEditMessage }) => {
  const [editMode, setEditMode] = useState(false)
  const [editText, setEditText] = useState(message.text)

  const onToggleEditMode = () => {
    setEditMode(!editMode)
  }

  const onChangeEditText = e => setEditText(e.target.value)

  const onSaveEditText = () => {
    onEditMessage(message, editText)
    setEditMode(false)
  }
  return (
    <li>
      {editMode ? (
        <input type="text" value={editText} onChange={onChangeEditText} />
      ) : (
        <span>
          <strong>{message.user.username || message.user.userId}</strong>{' '}
          {message.text} {message.editedAt && <span>(Edited)</span>}
        </span>
      )}
      {!editMode && (
        <button type="button" onClick={onRemoveMessage(message.uid)}>
          Delete
        </button>
      )}
      {editMode ? (
        <span>
          <button onClick={onSaveEditText}>Save</button>
          <button onClick={onToggleEditMode}>Cancel</button>
        </span>
      ) : (
        <button onClick={onToggleEditMode}>Edit</button>
      )}
    </li>
  )
}

const condition = authUser => !!authUser

export default compose(
  withAuthorization(condition),
  withEmailVerification
)(HomePage)
