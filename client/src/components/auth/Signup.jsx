import React from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

class Signup extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      passwordConfirm: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      errMsg: '',
    };

    /* METHOD BINDING */
    this.updateInputFields = this.updateInputFields.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  updateInputFields(e, field) {
    this.setState({
      [field]: e.target.value,
    });
  }

  submitHandler() {
    const { username, password, passwordConfirm, firstName, lastName, phone, email } = this.state;

    if (password !== passwordConfirm) {
      this.setState({ errMsg: 'Passwords do not match'});
    } else {
      const data = { username, password, firstName, lastName, phone, email };
      const ajaxOptions = {
        url: '/customer-signup',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: (redirectPath) => {
          console.log('Successfully signed up');
          window.location.replace(redirectPath);
        },
        error: (err) => {
          console.log('Error:', err);
          this.setState({ errMsg: err.message });
        }
      };
      $.ajax(ajaxOptions);
    }
  }

  validateInput(field) {
    // TODO: implement validation
  }

  render() {
    const { username, password, passwordConfirm, firstName, lastName, phone, email, errMsg } = this.state;
    return (
      <div className='container'>
        <div className='form-signin'>
          <h2 className='form-signin-heading'>Sign up</h2>
          <label className='sr-only'>Username</label>
          <input
            value={username}
            type='username'
            className='form-control'
            placeholder='Username'
            required autoFocus
            onChange={(e) => this.updateInputFields(e, 'username')}
          />
          <label className='sr-only'>Password</label>
          <input
            value={password}
            type='password'
            className='form-control'
            placeholder='Password'
            required
            onChange={(e) => this.updateInputFields(e, 'password')}
          />
          <label className='sr-only'>Re-enter Password</label>
          <input
            value={passwordConfirm}
            type='password'
            className='form-control'
            placeholder='Re-enter Password'
            required
            onChange={(e) => this.updateInputFields(e, 'passwordConfirm')}
          />
          <label className='sr-only'>First Name</label>
          <input
            value={firstName}
            type='text'
            className='form-control'
            placeholder='First Name'
            required
            onChange={(e) => this.updateInputFields(e, 'firstName')}
          />
          <label className='sr-only'>Last Name</label>
          <input
            value={lastName}
            type='text'
            className='form-control'
            placeholder='Last Name'
            required
            onChange={(e) => this.updateInputFields(e, 'lastName')}
          />
          <label className='sr-only'>Phone Number</label>
          <input
            value={phone}
            type='tel'
            className='form-control'
            placeholder='Phone Number'
            required
            onChange={(e) => this.updateInputFields(e, 'phone')}
          />
          <label className='sr-only'>Email</label>
          <input
            value={email}
            type='text'
            className='form-control'
            placeholder='Email'
            required
            onChange={(e) => this.updateInputFields(e, 'email')}
          />
          <br />
          {errMsg && <div className="alert alert-danger">{errMsg}</div>}
          <button
            className='btn btn-lg btn-primary btn-block'
            onClick={this.submitHandler}
          >
            Sign Up
          </button>
          <Link to="/managerlogin">Have an account already? Login</Link>
        </div>

      </div>
    );
  }
}

export default Signup;