import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import QDOT_GOOGLE_API_KEY from './googleMapAPI_KEY.js'

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
const K_HOVER_DISTANCE = 30;


export default class RestaurantsMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			center: {lat: 37.7749, lng: -122.4194},
			zoom: 12,
			restaurantName: 'HEllo',
			coordinates: [],
		};
	}

	componentDidMount() {
		this.setState({coordinates: this.props.coordinates});
	}

	_onClick ({x, y, lat, lng, event}) {
		console.log(x, y, lat, lng, event);
	}

  render() {
  	const Markers = this.state.coordinates.map((marker, index) => (
        <img
          key={marker.index}
          lat={marker.lat}
          lng={marker.lng}
          src="http://maps.google.com/mapfiles/kml/paddle/red-stars.png"
        />
      ));

    return (
      <div className="restaurant-map" >
 				<GoogleMapReact
						onClick={this._onClick}
		        center={this.state.center}
		        zoom={this.state.zoom}
		        // hoverDistance={K_HOVER_DISTANCE}
		        bootstrapURLKeys={{key: QDOT_GOOGLE_API_KEY}}
						resetBoundsOnResize = {true}
		      > 
		      {Markers}
        </GoogleMapReact>
      </div>
    );
  }
}



