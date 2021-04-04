import React from 'react';
import './matches.css';
import './events.css';
//import { Link, Redirect } from 'react-router-dom';
//import Utils from '../utils/utils';


class GetMatch extends React.Component
{
  getTeams = () =>
  {
    return this.props.event.teams.sort(
      (a, b) =>
      {
        return b.result - a.result;
      }
    );
  }

  render()
  {
    const teams = this.getTeams();
    return (
      <div className="match-container">
        <div className="event-header match-header">
          <p>{this.props.event.date}</p>
        </div>

        <div className="first-team-list">
          {teams[0].squad.map(name =>
            (
              <p className="match-player-name"
                 key={name}
              >
                {name}
              </p>
            )
          )}
        </div>

        <div className="match-score-cell">
          <p className="match-score-text">
            {teams[0].result
             + ':'
             + teams[1].result}
          </p>
        </div>

        <div className="second-team-list">
          {teams[1].squad.map(name =>
            (
              <p className="match-player-name"
                 key={name}
              >
                {name}
              </p>
            )
          )}
        </div>
      </div>
    );
  };
}
/*
class Matches extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      items: [],
    };
  }

  componentDidMount()
  {
    this.fetchMatches();
  }

  fetchMatches = () => {
    fetch('/api/matches').then(
      response => response.json()).then(
        responseJson => this.handleFetchedMatches(responseJson));
  };

  handleFetchedMatches = (responseJson) => {
    this.setState({items: responseJson.items});
  };


  render()
  {
    return (
      <div>
        <Link to='/matches/new'>
          <p>New Match</p>
        </Link>
        <div>
          {this.state.items.map((match, idx) => (
            <div className="read-match" key={match.date + match.match_number}>

              <div className="read-match-block
                            read-match-team
                            read-red-team">
                {match.teams.red.map((player, pn) => (
                  <p key={player}>{player}</p>
                ))}
              </div>

              <div className="read-match-block
                            read-score">
                <p className="read-match-date">
                  {match.date}
                </p>
                <p className="read-score-text">
                  {match.red_score + ':' + match.blue_score}
                </p>
              </div>

              <div className="read-match-block
                            read-match-team
                            read-blue-team">
                {match.teams.blue.map((player, pn) => (
                  <p key={player}>{player}</p>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    )
  }
}


class NewMatch extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      done: false,
      players: {
        red: [],
        blue: [],
      },
      score: {
        red: 0,
        blue: 0,
      },
      date: '',
    };
  }

  onPlayerNameChange = (team, idx, value) => {
    const players = this.state.players;
    players[team][idx] = value;
    this.setState({ players });
  }

  onNewInput = (team) => {
    const players = this.state.players;
    players[team].push('');
    this.setState({players});
  }

  handleDate = (event) => {
    this.setState({ date: event.target.value });
  }

  handleScore = (team, score) => {
    const scores = this.state.score;
    scores[team] = score;
    this.setState({ score: scores });
  }

  handleSubmit = () => {
    console.log(this.state);
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        date: this.state.date,
        red_score: this.state.score.red,
        blue_score: this.state.score.blue,
        teams: {
          red: this.state.players['red'].filter(player => player),
          blue: this.state.players['blue'].filter(player => player),
        }
      }),
    };

    fetch('/api/matches', requestOptions).then(
      response => response.json()
    ).then(
      data => {
        console.log(data);
        this.setState({ done: true });
      }
    );
  }

  render()
  {
    if (this.state.done)
    {
      return <Redirect to="/" />
    }

    return (
      <div>
        <div className="write-match">

          <div className="write-match-block
                          write-match-team
                          write-red-team">
            <Utils.ListWithAddition
              elements={this.state.players['red']}
              onPlayerNameChange={
                (idx, value) => this.onPlayerNameChange('red', idx, value)}
              onNewInput={() => this.onNewInput('red')}
            />
          </div>

          <div className="write-match-block
                          write-score">
            <input type="date" onChange={this.handleDate}/>
            <div>
              <input className="put-score
                                put-red-score"
                     type="number" min="0"
                     onChange={
                       (event) => this.handleScore(
                         'red', parseInt(event.target.value))
                     }
              />
              <p className="colon">:</p>
              <input className="put-score
                                put-blue-score"
                     type="number" min="0"
                     onChange={
                       (event) => this.handleScore(
                         'blue', parseInt(event.target.value))
                     }
              />
            </div>
          </div>

          <div className="write-match-block
                          write-match-team
                          write-blue-team">
            <Utils.ListWithAddition
              elements={this.state.players['blue']}
              onPlayerNameChange={
                (idx, value) => this.onPlayerNameChange('blue', idx, value)}
              onNewInput={() => this.onNewInput('blue')}
              />
          </div>

        </div>
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    )
  }
}
*/

const export_default = {
  GetMatch,
}
export default export_default;
