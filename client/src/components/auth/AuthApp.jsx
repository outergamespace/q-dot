import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router-dom';
import ManagerLogin from '../managerlogin/ManagerLogin.jsx';
import Signup from './Signup.jsx';

const AuthApp = () => (
  <div>
    <Route exact path="/managerlogin" component={ManagerLogin} />
    <Route exact path="/signup" component={Signup} />
  </div>
);

export default AuthApp;