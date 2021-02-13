import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import TrashUsers from './trashcan/users';
import Matches from './matches/matches';

/*
class AddUser extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      added_user: {
        name: '',
        salary: 0,
        married: false,
      }
    };
  }

  handleName = (text) => {
    console.log(this.state);

    const { added_user } = this.state;
    added_user.name = text.target.value;

    this.setState({
      added_user: added_user,
    });
  }

  handleSalary = (number) => {
    console.log(this.state);

    const { added_user } = this.state;
    added_user.salary = number.target.value;

    this.setState({
      added_user: added_user,
    });
  }

  handleMarital = (marital) => {
    console.log(this.state);

    const { added_user } = this.state;
    added_user.married = marital.target.value === "married";

    this.setState({added_user});
  }

  handleAddition = () => {
    const { added_user } = this.state;
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: added_user.name,
        salary: added_user.salary,
        married: added_user.married,
      }),
    };
    fetch('/api', requestOptions).then(
      response => response.json()
    ).then(
      data => {
        console.log(data);
        this.props.fetchList();
      }
    );
  }

  render()
  {
    return (
      <div>
        <input type="text"
               onChange={(text) => this.handleName(text)} />
        <input type="number"
               onChange={(number) => this.handleSalary(number)} />
        <select onChange={(marital) => this.handleMarital(marital)}>
          <option value="single">single</option>
          <option value="married">married</option>
        </select>
        <button onClick={this.handleAddition}>Add new man</button>
      </div>
    );
  }
}


class UserList extends React.Component {
  componentDidMount()
  {
    this.props.fetchList();
  }

  render() {
    return (
        <div className="home">
          <h1>This must be the home</h1>
          {this.props.items.map((elem, idx) => (
            <p key={idx}>
              {elem.username},
              {elem.salary},
              {elem.married ? 'true' : 'false'}
            </p>
          ))}
        </div>
    );
  }
}


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
    console.log('jj resp', responseJson);
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


class Home extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      items: [],
    };
  }

  handleFetchedList = (response) => {
    const items = response.items;
    this.setState({items});
    console.log('Fetched items:', items);
  }

  fetchList = () => {
    fetch('/api').then(
      response => response.json()).then(
        responseJson => this.handleFetchedList(responseJson));
  };

  render()
  {
    return (
      <div>
        <AddUser fetchList={this.fetchList} />
        <UserList fetchList={this.fetchList}
                  items={this.state.items}
        />
      </div>
    );
  }
}


class NewMatch extends React.Component {
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
    console.log('jj resp', responseJson);
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
*/

class MyRouter extends React.Component {
  render()
  {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Matches.Matches} />
          <Route path="/rest" exact component={TrashUsers.Home} />
          {/* TODO: Create another router inside Matches. */}
          <Route path="/matches/new" exact component={Matches.NewMatch} />
        </Switch>
      </BrowserRouter>
    );
  }
}

// ========================================

ReactDOM.render(
  <MyRouter />,
  document.getElementById('root')
);
