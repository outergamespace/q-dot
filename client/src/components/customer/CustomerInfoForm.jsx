import React from 'react';
import $ from 'jquery';
import GroupSizeSelector from './GroupSizeSelector.jsx';
import GoogleMap from './GoogleMap.jsx';

// the form where customers submit their information
// change it so customer info gets passed as props on authentication success
class CustomerInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.getGroupSize = this.getGroupSize.bind(this);
    this.submitCustomerInfo = this.submitCustomerInfo.bind(this);
    this.state = {
      groupSize: 0,
      currentRestaurantId: ''
    };
  }

  componentWillReceiveProps() {
    this.setState({
      coordinates: this.props.selectedCoordinates,
      // currentRestaurantId: this.props.currentRestaurantId
    });
  }

  getGroupSize(size) {
    this.setState({
      groupSize: size
    });
  }

  submitCustomerInfo() {
    let windowUrl = window.location.href;
    let id = windowUrl.slice(-1);

    $.ajax({
      method: 'POST',
      url: '/queues',
      data: JSON.stringify({
        // name, mobile, email should be removed when server handler retrieves info from db
        name: '',
        mobile: '',
        email: '',
        size: this.state.groupSize,
        restaurantId: id
      }),
      contentType: 'application/json',
      success: (data) => {
        console.log('this was a successful post request', data);
        this.props.customerInfoSubmitted(data.queueId, data.position);
        window.location.replace(`/customer/queueinfo?queueId=${data.queueId}`);
      },
      failure: (error) => {
        console.log('something went wrong with the post request', error);
      }
    });
  }

  render() {
    return (
      <div>
        <div className="customer-info-input-container">
          <div className="input-field col s6">
            <GroupSizeSelector getGroupSize={this.getGroupSize}/>
          </div>
          <div className="input-field col s6">
            <input className="waves-effect waves-light btn" type="submit" value="Add to Queue" onClick={this.submitCustomerInfo} />
          </div>
        </div>
        <br />
        <br />
        <GoogleMap className="map" display="block" margin="auto" coordinates={this.props.selectedCoordinates}/>
      </div>
    );
  }
}

export default CustomerInfoForm;
