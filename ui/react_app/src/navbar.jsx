import React from 'react';
import './navbar.css';
//import foosta_logo from '../public/foosta_logo.png';
import { Link } from 'react-router-dom';


class Navbar extends React.Component {
  render()
  {
    document.title = 'Foosta';

    return (
      <div className="navbar">
        <Link to="/">
          <img id="foosta-logo-navbar" src="foosta_logo.png" alt="logo" />
        </Link>

        <Link to="/">
          <button className="navbar-button">Stats</button>
        </Link>

        <Link to="/events">
          <button className="navbar-button">Events</button>
        </Link>
      </div>
      );
  }
}


const export_default = {
  Navbar,
}
export default export_default;
