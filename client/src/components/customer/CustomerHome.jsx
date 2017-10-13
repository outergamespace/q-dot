import React from 'react';
import CustomerNav from './CustomerNav.jsx';
import CustomerBanner from './CustomerBanner.jsx';
import SelectedRestaurant from './SelectedRestaurant.jsx';
import RestaurantCard from './RestaurantCard.jsx';
import RestaurantsMap from './RestaurantsMap.jsx';
import $ from 'jquery';
import { Link } from 'react-router-dom';

class CustomerHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRestaurant: false,
      currentRestaurant: {},
      restaurantList: [],
      coordinates: [
                    {lat: 37.79338, lng:-122.4225}, 
                    {lat: 37.7812215727578, lng:-122.40627989109},
                    {lat: 37.7602179, lng: -122.4110749},
                    {lat: 37.774905, lng: -122.437506},
                    {lat: 37.782787322998, lng: -122.462539672852},
                    {lat: 37.78374, lng: -122.433005},
                    {lat: 37.7642352, lng: -122.4306936},
                    {lat: 37.7769872, lng: -122.4385184},
                    {lat: 37.7570666079255, lng: -122.416596234642}
                   ],
      page: 'list',
      currentCustomer: null,
    };

    /* METHOD BINDING */
    this.changePage = this.changePage.bind(this);
    this.getRestaurantList = this.getRestaurantList.bind(this);
    this.getCurrentCustomer = this.getCurrentCustomer.bind(this);
  }

  componentDidMount() {
    this.getRestaurantList();
    this.getCurrentCustomer();
  }

  changePage() {
    this.state.page === 'list' 
    ? this.setState({ page: 'map' }) 
    : this.setState({ page: 'list' })
  }

  getRestaurantList() {
    $.ajax({
      method: 'GET',
      url: '/restaurants',
      success: (data) => {
        console.log('successfully grabbed restaurant data', data); 
        this.setState({ restaurantList: data });
      },
      failure: (error) => {
        console.log('failed to grab restaurant data', error);
      }
    });
  }

  getCurrentCustomer() {
    $.ajax({
      method: 'GET',
      url: '/user',
      success: (data) => {
        console.log('successfully grabbed queue data for customer', data);
        this.setState({ currentCustomer: data });
      },
      error: (error) => {
        console.log('failed to grab queue data for customer', error);
      }
    });
  }

  render() {
    return (
      <div className="customer-home">
        <CustomerBanner customer={this.state.currentCustomer} />
        <div className="nav-bar">
          <span className={this.state.page === 'list' ? 'select' : 'unselect'} onClick={this.changePage}>List</span>
          <span className={this.state.page === 'map' ? 'select' : 'unselect'} onClick={this.changePage}>Map</span>
        </div>
        {this.state.page === 'list'
        ? <div className="select-restaurant-container">
            <h4>Help me queue up at...</h4>
            {this.state.restaurantList.map(restaurant => (
              <div key={restaurant.id}>
                <Link to={`/restaurant/${restaurant.name}/${restaurant.id}`}><RestaurantCard restaurant={restaurant}/></Link>
              </div>
            ))}
          </div>
        : <RestaurantsMap coordinates={this.state.coordinates}/>}
      </div>
    );
  }

}

export default CustomerHome;







