import React from 'react';

const UserProfileHome = (props) => {
  let firstName = (props.user) ? props.user.firstName : 'None';
  let lastName = (props.user) ? props.user.lastName : 'None';
  let mobile = (props.user) ? props.user.mobile : 'None';
  let email = (props.user) ? props.user.email : 'None';

  return (
    <div className="container user-profile-home">
      <h3>User Profile</h3>
      <p>FirstName: {firstName}</p>
      <p>LastName: {lastName}</p>
      <p>PhoneNumber: {mobile}</p>
      <p>Email: {email}</p>
    </div>
  );
};

export default UserProfileHome;
