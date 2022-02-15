import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PersonalPage from './components/PersonalPage';
import TrashUsers from './trashcan/users';
import Navbar from './navbar';
import Events from './components/events';
import TotalPage from './components/TotalPage';


class MainRouter extends React.Component {
  render()
  {
    return (
      <BrowserRouter>
        <Navbar.Navbar />
        <Routes>
          <Route path="/" element={<TotalPage.TotalPage />} />
          <Route path="/rest" element={<TrashUsers.Home />} />
          <Route path="/events/*" element={<Events.EventsRouter />} />
          <Route path="/stats/:hero" element={
                   <PersonalPage.PersonalPageProxy />} />
        </Routes>
      </BrowserRouter>
    );
  }
}


class Foosta extends React.Component {
  render()
  {
    return (
      <MainRouter />
    );
  }
}


// ========================================

ReactDOM.render(
  <Foosta />,
  document.getElementById('root')
);
