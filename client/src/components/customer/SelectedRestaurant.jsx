import React from 'react';
import RestaurantLogoBanner from './RestaurantLogoBanner.jsx';
import CustomerInfoForm from './CustomerInfoForm.jsx';
import QueueInfo from './QueueInfo.jsx';
import RestaurantInformation from './RestaurantInformation.jsx';
import { Link } from 'react-router-dom';

class SelectedRestaurant extends React.Component {
  constructor(props) {
    super(props);
    this.customerInfoSubmitted = this.customerInfoSubmitted.bind(this);
    this.state = {
      currentRestaurant: null,
      infoSubmitted: false,
      queueId: 0,
      queuePosition: 0,
      ready: false,
      coordinates: {}
    };
  }

  componentDidMount() {
    this.getRestaurant();
  }

  getRestaurant() {
    let windowUrl = window.location.href;
    let id = windowUrl.slice(-1);
    let that = this;

    $.ajax({
      method: 'GET',
      url: `/restaurants?restaurantId=${id}`,
      success: (data) => {
        console.log('successfully grabbed current restaurant data', data.coordinates);
        that.setState({ currentRestaurant: data });
        that.setState({ coordinates: data.coordinates});
      },
      failure: (error) => {
        console.log('failed to grab current restaurant data', error);
      }
    });
  }

  customerInfoSubmitted(id, position) {
    this.setState({
      infoSubmitted: true,
      queueId: id,
      queuePosition: position
    });
  }

  render() {
    // Prevent making GET request while currentRestaurant is undefined.
    if (!this.state.currentRestaurant) {
      return <div />;
    }

    const restaurantImg = {
      backgroundImage: `url(../${this.state.currentRestaurant.image})`
    };
    
    return (
      <div className="selected-restaurant">
        <RestaurantLogoBanner style={restaurantImg} />
        <RestaurantInformation restaurant={this.state.currentRestaurant}/>
        <CustomerInfoForm customerInfoSubmitted={this.customerInfoSubmitted} selectedCoordinates={this.state.coordinates} />
      </div>
    );
  }
}

export default SelectedRestaurant;