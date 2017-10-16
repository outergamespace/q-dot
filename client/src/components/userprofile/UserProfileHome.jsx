import React from 'react';

// TODO: put this in a client-assessible util class, if needed elsewhere
const phoneNumberFormatter = (number) => {
  return number.replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3');
};

const UserProfileHome = (props) => {
  const DEFAULT_TEXT = 'None';
  const DEFAULT_PROFILE_IMAGE_URL = '/images/userprofile/orly_owl_avatar_medium.png';

  let firstName = (props.user && props.user.firstName) ? props.user.firstName : DEFAULT_TEXT;
  let lastName = (props.user && props.user.lastName) ? props.user.lastName : DEFAULT_TEXT;
  let mobile = (props.user && props.user.mobile) ?
    phoneNumberFormatter(props.user.mobile) : DEFAULT_TEXT;
  let email = (props.user && props.user.email) ? props.user.email : DEFAULT_TEXT;
  // TODO: we can add a profilePicture field to the User later
  let profilePicture = (props.user && props.user.profilePicture) ?
    props.user.profilePicture : DEFAULT_PROFILE_IMAGE_URL;

  return (
    <div className="container user-profile-home card-panel">
      <div className="user-profile-home-avatar">
        <img src="/images/userprofile/orly_owl_avatar_medium.png" />
      </div>
      <div className="user-profile-home-details">
        <div className="section">
          <h5 className="teal-text">First Name:</h5>
          <p>{firstName}</p>
        </div>
        <div class="divider"></div>
        <div className="section">
          <h5 className="teal-text">Last Name:</h5>
          <p>{lastName}</p>
        </div>
        <div class="divider"></div>
        <div className="section">
          <h5 className="teal-text">Phone Number:</h5>
          <p>{mobile}</p>
        </div>
        <div class="divider"></div>
        <div className="section">
          <h5 className="teal-text">Email:</h5>
          <p>{email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHome;
