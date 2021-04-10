import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import TrashUsers from './trashcan/users';
import Navbar from './navbar';
import Events from './components/events';
import Elo from './components/elo';


class MainRouter extends React.Component {
  render()
  {
    return (
      <BrowserRouter>
        <Navbar.Navbar />
        <Switch>
          <Route path="/" exact component={Elo.Elo} />
          <Route path="/rest" exact component={TrashUsers.Home} />
          <Route path="/events" component={Events.EventsRouter} />
        </Switch>
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
