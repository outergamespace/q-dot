import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react'; // https://github.com/istarkov/google-map-react
 // I placed the API key in a script tag within the index.html page
const greatPlaceStyle = {
  position: 'absolute',
  width: 40,
  height: 40,
  left: -20,
  top: -20,
  border: '5px solid #f44336',
  borderRadius: 40,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4
};
// The google-map-react library allows components to be placed inside the GoogleMapReact component
const Pickup = ({ text }) => <div >{text}</div>;

export default class GoogleMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			center: {lat: 37.7749, lng: -122.4194},
			zoom: 14
		}
	}

	_onClick ({x, y, lat, lng, event}) {
		console.log(x, y, lat, lng, event)
	}


  render() {
    return (

				<div style={{width: 800, height: 640, display: "block", margin: "auto"}} >
		      <GoogleMapReact
						onClick={this._onClick}
		        center={this.state.center}
		        zoom={this.state.zoom}
						size={{width:300, height:400}}
						resetBoundsOnResize = {true}
						// layerTypes={['TrafficLayer']}
		      >
		        <Pickup
		          lat={37.7933928}
		          lng={-122.4227072}
		          // text={'This Restaurant'}
		        />
		      </GoogleMapReact>
				</div>
    );
  }
}

