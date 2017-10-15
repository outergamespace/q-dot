import React from 'react';
// we'll use the pre-existing CustomerNav for simplicity
import CustomerNav from '../customer/CustomerNav.jsx';
import UserProfileHome from './UserProfileHome.jsx';

class UserProfileApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null
    };
  }

  getCurrentUser() {
    $.ajax({
      method: 'GET',
      url: '/user',
      success: (data) => {
        console.log('successfully grabbed queue data for user', data);
        this.setState({ currentUser: data });
      },
      error: (error) => {
        console.log('failed to grab queue data for user', error);
      }
    });
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  render() {
    return (
      <div className="user-profile">
        <CustomerNav />
        <UserProfileHome user={this.state.currentUser} />
      </div>
    );
  }
}

export default UserProfileApp;
