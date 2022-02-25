import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactRouterDom from 'react-router-dom';

import PersonalPage from 'components/PersonalPage';
import Navbar from 'components/Navbar';
import Events from 'components/events';
import TotalPage from 'components/TotalPage';

import 'index.css';


const MainRouter = () =>
{
  return <ReactRouterDom.BrowserRouter
  >
    <Navbar.Navbar />
    <ReactRouterDom.Routes>
      <ReactRouterDom.Route
        path="/" element={<TotalPage.TotalPage />}
      />
      <ReactRouterDom.Route
        path="/events/*" element={<Events.EventsRouter />}
      />
      <ReactRouterDom.Route
        path="/stats/:hero" element={<PersonalPage.PersonalPageProxy />}
      />
    </ReactRouterDom.Routes>
  </ReactRouterDom.BrowserRouter>;
};


const Foosta = () =>
{
  return <MainRouter />;
};


// ========================================

ReactDOM.render(
    <Foosta />,
    document.getElementById('root'),
);
