import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

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

				<div className="restaurant-map" >
		      <GoogleMapReact
						onClick={this._onClick}
		        center={this.state.center}
		        zoom={this.state.zoom}
						// size={{width:300, height:100}}
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

