import React from 'react';
import './post_event.css';
import PostMatch from './post_match';
import PostTournament from './post_tournament';


var ResponseStatus = {
  NOT_SET: 0,
  OK: 1,
  ERROR: 2,
};


class PostEvent extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      // Preparing payload for the POST request.
      event_type: 'match',

      date: '',
      teams: this.genTeamsState('match'),
      password: '',

      // Service fields.
      cachedPlayers: new Set(),

      responseStatus: ResponseStatus.NOT_SET,
      responseMessage: 'Ha!',
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
      // Let password remain the same.
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

  handlePassword = (event) =>
  {
    this.setState({ password: event.target.value });
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
        password: this.state.password,
      }),
    };

    fetch('/api/events', requestOptions).then(this.processResponse);
  }

  processResponse = (response) =>
  {
    response.json().then(responseJson =>
      {
        if (response.status === 201)
        {
          this.cachePlayers();
          this.resetForm();

          this.setState({
            responseStatus: ResponseStatus.OK,
            responseMessage: `Event "${responseJson['id']}" has been added.`,
          });
        }
        else
        {
          this.setState({
            responseStatus: ResponseStatus.ERROR,
            responseMessage: JSON.stringify(responseJson, null, 2),
          });
        }
      }
    )
  }

  drawResponseMessage = () =>
  {
    const responseStatus = this.state.responseStatus;
    if (responseStatus === ResponseStatus.NOT_SET)
    {
      return null;
    }

    const color = responseStatus === ResponseStatus.OK ?
          '#aaeeff' : '#ffaaaa';
    return (
      <pre className="post_event__response_message"
           style={{"background-color": color}}>
        {this.state.responseMessage}
      </pre>
    );
  }

  render()
  {
    return (
      <div>
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

        <div className="post_event__password-area">
          <label className="post_event__password-label">Password:</label>
          <input className="post_event__password-input"
                 value={this.state.password}
                 onChange={this.handlePassword}
          />

          <button className="submit-button"
                  onClick={this.handleSubmit}
          >Submit
          </button>
        </div>

        {this.drawResponseMessage()}
      </div>
    );
  };
}


const export_default = {
  PostEvent,
}
export default export_default;
