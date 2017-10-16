import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import QDOT_GOOGLE_API_KEY from './googleMapAPI_KEY.js'

//list view

// const greatPlaceStyle = {
//   position: 'absolute',
//   width: 40,
//   height: 40,
//   left: -20,
//   top: -20,
//   border: '5px solid #f44336',
//   borderRadius: 40,
//   backgroundColor: 'white',
//   textAlign: 'center',
//   color: '#3f51b5',
//   fontSize: 16,
//   fontWeight: 'bold',
//   padding: 4
// };

// const Marker = ({ text }) => <div style={greatPlaceStyle} ><img src="http://maps.google.com/mapfiles/kml/paddle/red-circle.png"/>{text}</div>;
// pulling png from internet, local dir not working
// const Marker = ({ text }) => <div><img src="http://maps.google.com/mapfiles/kml/paddle/red-circle.png"/>{text}</div>;


export default class RestaurantsMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			center: {lat: 37.7749, lng: -122.4248931640625},
			zoom: 12,
			restaurantName: '',
      waitTime: '',
			information: false,
			restaurantInfo: [],
      currentLocation: {lat: 0, lng: 0},
		};
	  this.jump = this.jump.bind(this);
		this.land = this.land.bind(this);
		this.showInfo = this.showInfo.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this.getUserLocation = this.getUserLocation.bind(this);
	}

	componentDidMount() {
		this.setState({restaurantInfo: this.props.restaurantInfo});
    this.getUserLocation();
	}

	_onClick ({x, y, lat, lng, event}) {
		console.log(x, y, lat, lng, event);
	}

	jump(text) {
		console.log(text);
  	this.setState({style: "jumped-marker"});
  }

  land(text) {
  	console.log(text);
    this.setState({style: "default-marker"});
  }

  showInfo(text, time) {
  	this.setState({restaurantName: text});
    this.setState({waitTime: time})
  	if (this.state.information === false) {
      this.setState({ information: true })
    } 
	}

  hideInfo() {
    this.setState({ information: false })
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }; 
        this.setState({currentLocation: { lat: userPosition.lat, lng: userPosition.lng }}); 
        return userPosition;
      }); 
    }
  }

  render() {
  	//might need to have each marker be a stateful component to for them to individully jump
  	const Markers = this.state.restaurantInfo.map((marker, index) => (
        <img
          className={this.state.style}
          key={marker.index}
          lat={marker.lat}
          lng={marker.lng}
          src="/icons/red-stars.png"
          onClick={(e) => this.showInfo(marker.name, marker.wait, e)} 
          onMouseOver={this.jump.bind(this, marker.name)}
          onMouseLeave={this.land.bind(this, marker.name)}
        />
      ));

    return (
      <div className="restaurant-map">
 				<GoogleMapReact
						onClick={this._onClick}
		        center={this.state.center}
		        zoom={this.state.zoom}
		        bootstrapURLKeys={{key: QDOT_GOOGLE_API_KEY}}
						resetBoundsOnResize = {true}
		      > 
		      {Markers}
		      {this.state.information === true
	        ? <div className="information-box" onClick={(e) => this.hideInfo(e)}>
  	        	<div class="row"> 
  				      <div class="col s6 m2">
  				        <div class="card-panel-custom blue-grey darken-2">
                    <div class="white-text-close-custom">x</div>
                    <br/>
  				          <span class="white-text-title-custom">{this.state.restaurantName}</span>
                    <br/>
                    <br/>
                    <span class="white-text-custom">{"Wait time: "}{this.state.waitTime}</span>
  				        </div>
  				      </div>
  				    </div>
            </div>
	        : null}
          <img position="absolute"
            height="40"
            width="40"
            lat={this.state.currentLocation.lat}
            lng={this.state.currentLocation.lng}
            text="You are Here"
            src="http://maps.google.com/mapfiles/arrow.png"/>
        </GoogleMapReact>
      </div>
    );
  }
}