import React, { Component } from 'react';
import { Navbar, NavbarToggler, NavbarBrand } from 'reactstrap';

//import './css/Navigation.css';

class Navigation extends Component {
  render() {
    return (
        <div className="navigation-bar">
            <Navbar color="faded" light>
                <NavbarBrand href="/" className="mr-auto">mydatingapp.com</NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            </Navbar>
        </div>
    )
  }
}

export default Navigation;