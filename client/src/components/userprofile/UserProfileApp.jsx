import React from 'react';
// we'll use the pre-existing CustomerNav for simplicity
import CustomerNav from '../customer/CustomerNav.jsx';
import UserProfileHome from './UserProfileHome.jsx';

const UserProfileApp = (props) => (
  <div className="user-profile">
    <CustomerNav />
    <UserProfileHome />
  </div>
);

export default UserProfileApp;
