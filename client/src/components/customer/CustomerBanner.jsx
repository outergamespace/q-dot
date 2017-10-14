import React from 'react';

// nav bar
const CustomerBanner = ({ customer }) => {
  let welcomeMessage = customer ? `Welcome back, ${customer.firstName}!` : 'Welcome!';
  let queueMessage = customer && customer.restaurant && <p className="restaurant-queued-at">You are currently queued at {customer.restaurant.name.toUpperCase()}</p>;

  let months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  let d = new Date();

  let curr_date = d.getDate();
  let curr_month = d.getMonth();
  let date_now = (curr_date + ' ' + months[curr_month]);

  return (
    <div className="gradient-banner-container-custom">
      <div className="banner-content">
        <p className="banner-title">{welcomeMessage}</p>
        {queueMessage}
      </div>
      <div className="date-container">
        <p className="date-info">Today is {date_now}</p>
      </div>
    </div>
  );
};

export default CustomerBanner;
