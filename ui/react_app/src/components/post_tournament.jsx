import React from 'react';
import PropTypes from 'prop-types';

import PropTypesUtils from 'utils/PropTypes';

import 'components/post_tournament.css';


/* eslint-disable require-jsdoc */
class PostTournament extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state =
    {
      dropdownOptions: [[]],
    };
  }

  handleDate = (event) =>
  {
    this.props.setStateDate(event.target.value);
  };

  handleScore = (event, teamId) =>
  {
    const teams = this.props.teams;
    teams[teamId].result = +event.target.value;
    this.props.setStateTeams(teams);
  };

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
  };

  handleTabKey = (event, teamId) =>
  {
    if (event.key !== 'Tab')
    {
      return;
    }

    const options = this.state.dropdownOptions[teamId] || [];
    if (!options.length)
    {
      return;
    }
    event.preventDefault();

    let pos = -1;
    for (const i in options)
    {
      if (event.target.value.toLowerCase() === options[i].toLowerCase())
      {
        pos = +i;
        break;
      }
    }
    event.target.value = options[(pos + 1) % options.length];
  };

  handlePlayerInput = (event, teamId) =>
  {
    const value = event.target.value;
    const result = [];
    const teams = this.props.teams;
    for (const player of this.props.cachedPlayers)
    {
      if (value === '')
      {
        // If value is an empty string, don't suggest anything.
        continue;
      }

      let alreadyThere = false;
      for (const i in teams)
      {
        if (teams[i].squad.includes(player))
        {
          alreadyThere = true;
          break;
        }
      }
      if (alreadyThere)
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
    this.setState({dropdownOptions});
  };

  listPlayers = (teamId) =>
  {
    const result = [];

    const squad = this.props.teams[teamId].squad;
    for (let i = 0; i < squad.length; i++)
    {
      const name = squad[squad.length - 1 - i];
      if (this.props.cachedPlayers.has(name))
      {
        result.push(name);
      }
      else
      {
        result.push(name + ' (new?)');
      }
    }

    return result;
  };

  displayTeams = () =>
  {
    const response = [];
    for (let teamId = 0; teamId < this.props.teams.length; teamId++)
    {
      response.push(
          <div className="post_tournament__team-list"
            key={'players_' + teamId}
          >
            <input className="post_tournament__player-input"
              onKeyUp={(event) => this.handleNewPlayer(event, teamId)}
              onKeyDown={(event) => this.handleTabKey(event, teamId)}
              onChange={(event) => this.handlePlayerInput(event, teamId)}
              list={'post_tournament__options-' + teamId} />
            <datalist id={'post_tournament__options-' + teamId}>
              {(this.state.dropdownOptions[teamId] || []).map((name) =>
                <option key={name}>{name}</option>,
              )}
            </datalist>
            {this.listPlayers(teamId).map((name) =>
              <p className="match-player-name"
                key={name}>
                {name}
              </p>,
            )}
          </div>,
      );

      response.push(
          <div className="post_tournament__score-area"
            key={'score_' + teamId}
          >
            <input className="post_tournament__score-input"
              type="number" min="0"
              value={this.props.teams[teamId].result}
              onChange={(event) => this.handleScore(event, teamId)}
            />
          </div>,
      );
    }

    return response;
  };

  render()
  {
    return (
      <div className="post_tournament__window">
        <div className="post_tournament__tournament-container">
          <div className="post_tournament__header">
            <input className="post_tournament__date"
              type="date"
              value={this.props.date}
              onChange={this.handleDate} />
          </div>

          {this.displayTeams()}
        </div>
        <div className="post_tournament__button-container">
          <button className="post_tournament__add-team"
            onClick={this.props.addTeam}
          >
            Add One More Team
          </button>
        </div>
      </div>
    );
  };
}


PostTournament.propTypes =
{
  ...PropTypesUtils.POST_MATCH_FIELDS,
  addTeam: PropTypes.func.isRequired,
};


const exportDefault =
{
  PostTournament,
};
export default exportDefault;
