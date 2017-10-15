import React from 'react';

// nav bar
class CustomerNav extends React.Component {
  constructor() {
    super();
    this.state = {
      currentCustomer: null,
    };
  }

  componentDidMount() {
    this.getCurrentCustomer();
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
    let menu;
    if (this.state.currentCustomer) {
      menu = (
        <ul id="dropdown1" className="dropdown-content">
          <li><a href="/">home</a></li>
          <li className="divider"></li>
          <li><a href="/logout">logout</a></li>;
        </ul>
      );
    } else {
      menu = (
        <ul id="dropdown1" className="dropdown-content">
          <li className=""><a href="/">home</a></li>
          <li className="divider"></li>
          <li><a href="/signup">signup</a></li>
          <li className="divider"></li>
          <li><a href="/managerlogin">login</a></li>
        </ul>
      );
    }

    return (
      <div className="customer-nav-bar">
        {menu}
        <nav>
          <div className="nav-wrapper">
            <ul className="nav-mobile dropdown">
              <li><a className="dropdown-button" href="#!" data-activates="dropdown1">q.<i className="material-icons right">arrow_drop_down</i></a></li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default CustomerNav;
