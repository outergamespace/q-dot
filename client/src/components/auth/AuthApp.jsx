import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import ManagerLogin from './managerlogin/ManagerLogin.jsx';
import Signup from './auth/Signup.jsx';

const AuthApp = () => (
  <div>
    <Route exact path="/managerlogin" component={ManagerLogin} />
    <Route exact path="/signup" component={Signup} />
    
    <div>
      <Link to="/managerlogin">Login</Link>
      <Link to="/signup">Signup</Link>
    </div>
  </div>
);
