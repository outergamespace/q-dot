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

export default class GoogleMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			center: {lat: 37.7749, lng: -122.4194},
			zoom: 13,
			restaurantName: ''
		}
	}

	componentDidMount() {
		console.log('coordinates',this.props.coordinates);
		// this.setState({center: {lat: this.props.coordinates.latitude, lng: this.props.coordinates.longitude}});
	}

	_onClick ({x, y, lat, lng, event}) {
		console.log(x, y, lat, lng, event)
	}

  render() {
    return (
				<div className="restaurant-map" >
 					<GoogleMapReact
 					  bootstrapURLKeys={{key: QDOT_GOOGLE_API_KEY}}
						onClick={this._onClick}
		        center={{lat: this.props.coordinates.latitude, lng: this.props.coordinates.longitude}}
		        zoom={this.state.zoom}
						resetBoundsOnResize = {true}
		      >
          <img position="absolute"
          lat={this.props.coordinates.latitude}
          lng={this.props.coordinates.longitude}
          text={this.state.restaurantName}
          src="http://maps.google.com/mapfiles/kml/pal4/icon51.png"/>

		      </GoogleMapReact>
				</div>

    );
  }
}

