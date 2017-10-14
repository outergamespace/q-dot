import React from 'react';
import ReactDOM from 'react-dom';
import UserProfileApp from './components/userprofile/UserProfileApp.jsx';
import '../../node_modules/jquery/dist/jquery.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';
ReactDOM.render((<UserProfileApp />), document.getElementById('app'));
