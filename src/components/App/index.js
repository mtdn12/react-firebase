import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { FirebaseContext } from '../Firebase'
import { AuthUserContext } from '../Session'
import Navigation from '../Navigation'
// import LandingPage from '../Landing'
import SignUpPage from '../SignUp'
import SignInPage from '../SignIn'
import PasswordForgetPage from '../PasswordForget'
import HomePage from '../Home'
import AccountPage from '../Account'
import AdminPage from '../Admin'
import * as ROUTES from '../../constants/routes'

const App = () => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem('authUser'))
  )
  const firebase = useContext(FirebaseContext)
  useEffect(() => {
    const listener = firebase.onAuthUserListener(
      auth => {
        localStorage.setItem('authUser', JSON.stringify(auth))
        setAuthUser(auth)
      },
      () => setAuthUser(null)
    )
    return () => {
      // Clear listener
      localStorage.removeItem('authUser')
      listener()
    }
  }, [])
  console.log(authUser)
  return (
    <AuthUserContext.Provider value={authUser}>
      <Router>
        <div>
          <Navigation />
          <hr />
          <Switch>
            {/* <Route exact path={ROUTES.LANDING} component={LandingPage} /> */}
            <Route
              exact
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route exact path={ROUTES.ADMIN} component={AdminPage} />
            <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
          </Switch>
        </div>
      </Router>
    </AuthUserContext.Provider>
  )
}

export default App
