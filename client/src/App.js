import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Redirect, Switch } from "react-router-dom";
import { attemptGetUser } from "./store/thunks/user";

import ConfirmPage from './components/ConfirmPage'
import Entrants from './components/Entrants'
import Profile from './components/Profile'
import NavBar from './components/NavBar'
import LoginForgot from './components/LoginForgot'
import Login from './components/Login'
import LoginResetPassword from './components/LoginResetPassword'
import Logout from './components/Logout'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

export default function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(attemptGetUser())
      .then(() => { setLoading(false) })
      .catch(() => { setLoading(false) });
    // eslint-disable-next-line
  }, []);

  return (
    <ErrorBoundary >
      <NavBar />
      {loading ? (
        <p>Loading</p>
      ) : (
        <Switch>
          <Route path='/entrants' exact component={Entrants} />
          <ProtectedRoute path='/my-profile' exact component={Profile} />
          <Route path='/account/confirm/:token' exact component={ConfirmPage} />
          <Route path='/register' exact component={Register} />
          <Route path='/login' exact component={Login} />
          <Route path='/login/forgot' exact component={LoginForgot} />
          <Route path='/login/reset/:token' component={LoginResetPassword} />
          <ProtectedRoute path='/logout' exact component={Logout} />
          <Redirect from='/' exact to='/entrants' />
          <ProtectedRoute to='/entrants' />
        </Switch>
      )}
    </ErrorBoundary >
  );
}
