import React from 'react';
import './events.css';
import {Routes, Route} from 'react-router-dom';
import Matches from './matches';
import Tournaments from './tournaments';
import PostEvent from './post_event';


/* eslint-disable require-jsdoc */
class ListEvents extends React.Component
{
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

  fetchEvents = () =>
  {
    fetch('/api/events').then(
        (response) => response.json()).then(
        (responseJson) => this.handleFetchedEvents(responseJson));
  };

  handleFetchedEvents = (responseJson) =>
  {
    this.setState({events: responseJson.items});
  };

  getEvents = () =>
  {
    const result = [];
    const events = this.state.events;
    for (const id of Object.keys(events).sort().reverse())
    {
      if (events[id].event_type === 'match')
      {
        result.push(
            <Matches.GetMatch
              key={id}
              event={events[id]}
            />,
        );
      }
      else
      {
        result.push(
            <Tournaments.GetTournament
              key={id}
              event={events[id]}
            />,
        );
      }
    }

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


class EventsRouter extends React.Component
{
  render()
  {
    return (
      <Routes>
        <Route path="/" element={<ListEvents />} />
        <Route path="/new" element={<PostEvent.PostEvent />} />
      </Routes>
    );
  }
}


const exportDefault = {
  EventsRouter,
};
export default exportDefault;
