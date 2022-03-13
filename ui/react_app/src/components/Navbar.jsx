import React from 'react';
import * as ReactRouterDom from 'react-router-dom';

import 'components/navbar.css';


const Navbar = () =>
{
  document.title = 'Foosta';

  return (
    <div className="navbar">
      <ReactRouterDom.Link to="/">
        <img id="foosta-logo-navbar" src='/foosta_logo.png' alt="logo" />
      </ReactRouterDom.Link>

      <ReactRouterDom.Link to="/">
        <button className="navbar-button">Stats</button>
      </ReactRouterDom.Link>

      <ReactRouterDom.Link to="/events">
        <button className="navbar-button">Events</button>
      </ReactRouterDom.Link>
    </div>
  );
};


const exportDefault = {
  Navbar,
};
export default exportDefault;
