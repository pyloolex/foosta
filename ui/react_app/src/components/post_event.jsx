import React from 'react';
import './post_event.css';
import PostMatch from './post_match';
import PostTournament from './post_tournament';


class PostEvent extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      event_type: 'match',

      date: '',
      teams: this.genTeamsState('match'),

      cachedPlayers: new Set(),
    };
  }

  componentDidMount()
  {
    this.cachePlayers();
  }

  cachePlayers = () =>
  {
    fetch('/api/stats/elo').then(response => response.json()).then(
      responseJson => {
        this.setState(
          {
            cachedPlayers: new Set(Object.keys(responseJson.items))
          }
        );
      }
    );
  }

  handleSubmit = () =>
  {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        event_type: this.state.event_type,
        date: this.state.date,
        teams: this.state.teams,
      }),
    };

    fetch('/api/events', requestOptions).then(
      response => response.json()).then(
        responseJson => {
          console.log(responseJson);
          // TODO(ferc): Reset form only when the event has been
          // successfully created. Otherwise, it's convenient to
          // see a form in order to figure out where the error is.
          this.resetForm();
          this.cachePlayers();
        }
      )
  }

  genTeamsState = (event_type) =>
  {
    return (
      event_type === 'match'
        ?
        [
          {result: '', squad: []},
          {result: '', squad: []},
        ]
        :  // event_type === 'tournament'
        [
          {result: '', squad: []},
        ]
    );
  }

  resetForm = () =>
  {
    this.setState({
      date: '',
      teams: this.genTeamsState(this.state.event_type),
    });
  }

  handleEventType = (event) =>
  {
    const event_type = event.target.value;
    this.setState({
      event_type: event_type,
      teams: this.genTeamsState(event_type),
    });
  }

  setStateDate = (date) =>
  {
    this.setState({ date });
  }

  setStateTeams = (teams) =>
  {
    this.setState({ teams });
  }

  addTeam = () =>
  {
    const teams = this.state.teams;
    teams.push({ result: '', squad: [] });
    this.setState({ teams });
  }

  render()
  {
    return (
      <div className="post-container">
        <div className="event-type-area">
          <label className="label">Event type:</label>
          <select className="select"
                  onChange={this.handleEventType}
                  value={this.state.event_type}
          >
            <option value="match">Match</option>
            <option value="tournament">Tournament</option>
          </select>
        </div>
        <div className="submit-area">
          <button className="submit-button"
                  onClick={this.handleSubmit}
          >Submit</button>
        </div>
          {this.state.event_type === 'match'
           ? <PostMatch.PostMatch date={this.state.date}
                                    setStateDate={this.setStateDate}
                                    teams={this.state.teams}
                                    setStateTeams={this.setStateTeams}
                                    cachedPlayers={this.state.cachedPlayers}
             />
           : <PostTournament.PostTournament date={this.state.date}
                                            setStateDate={this.setStateDate}
                                            teams={this.state.teams}
                                            setStateTeams={this.setStateTeams}
                                            cachedPlayers={
                                              this.state.cachedPlayers}
                                            addTeam={this.addTeam}
             />
          }
      </div>
    );
  };
}


const export_default = {
  PostEvent,
}
export default export_default;
