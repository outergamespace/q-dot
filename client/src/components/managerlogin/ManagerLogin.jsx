import React from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import '../../../dist/managerlogin/styles.css';
import CustomerNav from '../customer/CustomerNav.jsx';

class ManagerLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      unauthorised: false
    };

    /* METHOD BINDING */
    this.updateInputFields = this.updateInputFields.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  updateInputFields(event, field) {
    this.setState({
      [field]: event.target.value
    });
  }

  submitHandler(role) {
    var self = this;
    const { username, password } = this.state;
    const data = { username, password, role };
    const ajaxOptions = {
      url: `/${role}login`,
      method: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: (data) => {
        console.log('LOGIN SUCCESS: ', data);
        self.setState({
          unauthorised: false
        });
        window.location.href = data;
      },
      failure: (err) => {
        console.log('failed to load page', err);
      },
      statusCode: {
        401: function() {
          self.setState({
            unauthorised: true
          });
        }
      },
    };
    $.ajax(ajaxOptions);
  }

  render() {
    return (
      <div className='container'>
        <div className='form-signin'>
        <button className='btn btn-lg btn-primary btn-block'><span className="bigger">q.</span> Home</button>
          <h2 className='form-signin-heading'>Please sign in</h2>
          <label className='sr-only'>Username</label>
          <input
            value={this.state.username}
            type='username'
            className='form-control'
            placeholder='Username'
            required autoFocus
            onChange={(e) => this.updateInputFields(e, 'username')}
          />
          <label className='sr-only'>Password</label>
          <input
            value={this.state.password}
            type='password'
            className='form-control'
            placeholder='Password'
            required
            onChange={(e) => this.updateInputFields(e, 'password')}
          />
          <br />
          {
            this.state.unauthorised
              && <div className="alert alert-danger"> invalid credentials - please try again! </div>
          }
          <button
            className='btn btn-lg btn-primary btn-block'
            onClick={() => this.submitHandler('customer')}
          >
            Log in as Customer
          </button>
          <button
            className='btn btn-lg btn-primary btn-block'
            onClick={() => this.submitHandler('manager')}
          >
            Log in as Manager
          </button>

          <Link to="/signup">New user? Sign up now</Link>
        </div>

      </div>
    );
  }
}

export default ManagerLogin;
