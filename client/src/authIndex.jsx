import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import AuthApp from './components/auth/AuthApp.jsx';
import '../../node_modules/jquery/dist/jquery.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';
ReactDOM.render((
  <BrowserRouter>
    <AuthApp />
  </BrowserRouter>
), document.getElementById('login'));
