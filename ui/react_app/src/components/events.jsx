import React from 'react';
import './events.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Matches from './matches';
import Tournaments from './tournaments';


class ListEvents extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      events: {},
    };
  }

  componentDidMount()
  {
    this.fetchEvents();
  }

  fetchEvents = () => {
    fetch('/api/events').then(
      response => response.json()).then(
        responseJson => this.handleFetchedEvents(responseJson));
  };

  handleFetchedEvents = (responseJson) =>
  {
    console.log('resp', responseJson.items);
    this.setState({events: responseJson.items});
  };

  getEvents = () =>
  {
    const result = [];
    const events = this.state.events;
    for (let id of Object.keys(events).sort().reverse())
    {
      console.log(id, events[id]);
      if (events[id].event_type === 'match')
      {
        result.push(
          <Matches.GetMatch
            key={id}
            event={events[id]}
          />
        );
      }
      else
      {
        result.push(
          <Tournaments.GetTournament
            key={id}
            event={events[id]}
          />
        );
      }
    }

    console.log('res', result);
    return result;
  };

  render()
  {
    return (
      <div>
        {this.getEvents()}
      </div>
    );
  };
}


class EventsRouter extends React.Component {
  render()
  {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/events" exact component={ListEvents} />
        </Switch>
      </BrowserRouter>
    );
  }
}


const export_default = {
  EventsRouter,
}
export default export_default;
