import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import TrashUsers from './trashcan/users';
//import Matches from './matches/matches';
import Navbar from './navbar';
import Events from './components/events';


class FutureMain extends React.Component {
  render()
  {
    return (
      <div>Future Main</div>
    );
  }
}


class MainRouter extends React.Component {
  render()
  {
    return (
      <BrowserRouter>
        <Navbar.Navbar />
        <Switch>
          <Route path="/" exact component={FutureMain} />
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
