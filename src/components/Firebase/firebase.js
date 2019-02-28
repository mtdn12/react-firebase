import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

var config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}

class Firebase {
  constructor() {
    app.initializeApp(config)
    this.auth = app.auth()
    this.db = app.database()
    this.googleProvider = new app.auth.GoogleAuthProvider()
    this.facebookProvider = new app.auth.FacebookAuthProvider()
    this.emailAuthProvider = app.auth.EmailAuthProvider
  }
  // Auth Api
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider)

  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider)

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    })

  doSignOut = () => this.auth.signOut()

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password)

  // User api
  user = uid => this.db.ref(`users/${uid}`)

  users = () => this.db.ref('users')

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(auth => {
      if (auth) {
        this.user(auth.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val()

            if (!dbUser.roles) {
              dbUser.roles = []
            }
            // merge auth and db user
            auth = {
              uid: auth.uid,
              email: auth.email,
              emailVerified: auth.emailVerified,
              providerData: auth.providerData,
              ...dbUser,
            }
            next(auth)
          })
      } else {
        fallback()
      }
    })
}

export default Firebase
