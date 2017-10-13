import React from 'react';

const RestaurantInformation = (props) => {
  let groupsText; // change text following group length indicator to be grammatically correct
  props.restaurant.queues.length === 1 ? groupsText = 'waiting' : groupsText = 'waiting';

  let statusCircle;
  const openStatusCircle = {
    background: '#4FD135'
  };
  const closedStatusCircle = {
    background: '#C01717'
  };

  let waitTime = <div className="restaurant-wait-time"><i className="tiny material-icons">access_time</i> {props.restaurant.total_wait - props.restaurant.average_wait} mins</div>;
  props.restaurant.status === 'Closed' ? statusCircle = closedStatusCircle : statusCircle = openStatusCircle;
  props.restaurant.status === 'Closed' ? waitTime = undefined : waitTime;

  return (

    <div className="restaurant-info-container row">
      <div className="restaurant-info col s12 m6 l4">
        <div className="restaurant-name">{props.restaurant.name}</div>
        <div className="restaurant-queue-info">
          <div className="restaurant-queue-count">{props.restaurant.queues.length} {groupsText} {waitTime}</div>
          <div className="restaurant-queue-status"><span className="status-circle" style={statusCircle}/>{props.restaurant.status}</div>
        </div>
      </div>
      <div className="col l4 hide-on-med-and-down yelp-info">
        <p>{props.restaurant.location.display_address[0]}</p>
        <p>{props.restaurant.location.display_address[1]}</p>
        <p>{props.restaurant.phone}</p>        
      </div>
      <div className="col l4 m6 hide-on-small-only yelp-info">

        {/*TODO sort out serving img.<a href={props.restaurant.url}><img src="./../images/Yelp_trademark_RGB_outline.png" alt=""/></a>*/}
        <a href={props.restaurant.yelpURL}><img className="yelp-logo" src="https://s3-media3.fl.yelpcdn.com/assets/srv0/styleguide/b62d62e8722a/assets/img/brand_guidelines/yelp_fullcolor_outline@2x.png" alt=""/></a>
        {/*TODO - could use entire array of categories?*/}
        <p>{props.restaurant.categories[0].title}</p>
        <p>Prices - {props.restaurant.price}</p>
        <p>Yelp Rating - {props.restaurant.rating}</p>
      </div>
    </div>
  );
};

export default RestaurantInformation;