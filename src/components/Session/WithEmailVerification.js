import React, { useContext, useState } from 'react'

import AuthUserContext from './context'
import { FirebaseContext } from '../Firebase'

const withEmailVerification = Component => {
  const [isSent, setIsSent] = useState(false)
  const needsEmailVerification = auth =>
    auth &&
    !auth.emailVerified &&
    auth.providerData.map(provider => provider.providerId).includes('password')

  const onSendEmailVerification = () => {
    firebase.onSendEmailVerification().then(() => setIsSent(true))
  }

  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)

  return props =>
    needsEmailVerification(auth) ? (
      <div>
        {isSent ? (
          <p>
            E-Mail confirmation sent: Check you E-mails (Spam folder included)
            for a confirmation E-Mail. Refresh this page once you confirmed your
            E-Mail
          </p>
        ) : (
          <p>
            Verify your E-mail : check you E-mail (spam folder included) for a
            confirmation E-mail or send another confirmation E-mail
          </p>
        )}
        <button
          type="button"
          onClick={onSendEmailVerification}
          disabled={isSent}>
          Send confirmation E-mail
        </button>
      </div>
    ) : (
      <Component {...props} />
    )
}

export default withEmailVerification
