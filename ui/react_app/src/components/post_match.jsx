import React from 'react';
import './post_match.css';


class PostMatch extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state =
    {
      dropdownOptions: [[], []],
    }
  }

  handleDate = (event) =>
  {
    this.props.setStateDate(event.target.value);
  }

  handleScore = (event, teamId) =>
  {
    const teams = this.props.teams;
    teams[teamId].result = event.target.value;
    this.props.setStateTeams(teams);
  }

  handleNewPlayer = (event, teamId) =>
  {
    if (event.key !== 'Enter')
    {
      return;
    }

    // TODO(ferc): Add only if it didn't exist before.
    const teams = this.props.teams;
    teams[teamId].squad.push(event.target.value);
    this.props.setStateTeams(teams);

    event.target.value = '';
    this.handlePlayerInput(event, teamId);
  }

  handleTabKey = (event, teamId) =>
  {
    if (event.key !== 'Tab')
    {
      return;
    }

    const options = this.state.dropdownOptions[teamId];
    if (!options.length)
    {
      return;
    }
    event.preventDefault();

    let pos = -1;
    for (let i in options)
    {
      if (event.target.value.toLowerCase() === options[i].toLowerCase())
      {
        pos = +i;
        break;
      }
    }
    event.target.value = options[(pos + 1) % options.length];
  }

  handlePlayerInput = (event, teamId) =>
  {
    const value = event.target.value;
    let result = [];
    const teams = this.props.teams;
    for (let player of this.props.cachedPlayers)
    {
      if (value === '')
      {
        // If value is an empty string, don't suggest anything.
        continue;
      }

      if (teams[0].squad.includes(player)
          || teams[1].squad.includes(player))
      {
        continue;
      }

      if (player.toLowerCase().startsWith(value.toLowerCase()))
      {
        result.push(player);
      }
    }

    const dropdownOptions = this.state.dropdownOptions;
    dropdownOptions[teamId] = result;
    this.setState({ dropdownOptions });
  }

  listPlayers = (teamId) =>
  {
    const result = []

    const squad = this.props.teams[teamId].squad;
    for (let i in squad)
    {
      const name = squad[squad.length - 1 - i];
      if (this.props.cachedPlayers.has(name))
      {
        result.push(name);
      }
      else
      {
        if (teamId === 0)
        {
          result.push(name + " (new?)");
        }
        else
        {
          result.push("(new?) " + name);
        }
      }
    }

    return result;
  }

  render()
  {
    return (
      <div className="post_match__match-container">
        <div className="post_match__header">
          <input className="post_match__date"
                 type="date"
                 value={this.props.date}
                 onChange={this.handleDate} />
        </div>

        <div className="post_match__first-team">
          <input className="post_match__player-input"
                 onKeyUp={(event) => this.handleNewPlayer(event, 0)}
                 onKeyDown={(event) => this.handleTabKey(event, 0)}
                 onChange={(event) => this.handlePlayerInput(event, 0)}
                 list="post_match__options-first" />
          <datalist id="post_match__options-first">
            {this.state.dropdownOptions[0].map(name =>
              <option key={name}>{name}</option>
            )}
          </datalist>
          {this.listPlayers(0).map(name =>
            <p className="match-player-name"
               key={name}>
               {name}
            </p>
          )}
        </div>

        <div className="post_match__score-area">
          <div>
          <input className="post_match__score-input"
                 type="number" min="0"
                 value={this.props.teams[0].result}
                 onChange={(event) => this.handleScore(event, 0)}
          />
          <p className="colon">:</p>
          <input className="post_match__score-input"
                 type="number" min="0"
                 value={this.props.teams[1].result}
                 onChange={(event) => this.handleScore(event, 1)}
          />
            </div>
        </div>

        <div className="post_match__second-team">
          <input className="post_match__player-input"
                 onKeyUp={(event) => this.handleNewPlayer(event, 1)}
                 onKeyDown={(event) => this.handleTabKey(event, 1)}
                 onChange={(event) => this.handlePlayerInput(event, 1)}
                 list="post_match__options-second"
          />
          <datalist id="post_match__options-second">
            {this.state.dropdownOptions[1].map(name =>
              <option key={name}>{name}</option>
            )}
          </datalist>
          {this.listPlayers(1).map(name =>
            <p className="match-player-name"
               key={name}>
              {name}
            </p>
          )}
        </div>
      </div>
    );
  };
}


const export_default = {
  PostMatch,
}
export default export_default;
