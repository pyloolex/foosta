import React from 'react';

import PropTypesUtils from 'utils/PropTypes';

import 'components/events.css';
import 'components/tournaments.css';


/* eslint-disable require-jsdoc */
class GetTournament extends React.Component
{
  getTeams = () =>
  {
    return this.props.event.teams.sort(
        (a, b) =>
        {
          return a.result - b.result;
        },
    );
  };

  getPrizeColor = (place) =>
  {
    if (place === 1)
    {
      return '#FFD700';
    }
    if (place === 2)
    {
      return '#D3D3D3';
    }
    if (place === 3)
    {
      return '#CD7F32';
    }
    // This is the foosta's base background color.
    return '#F0FFFB';
  };

  render = () =>
  {
    return (
      <div className="tournament-container">
        <div className="event-header tournament-header">
          <p>{this.props.event.date}</p>
        </div>
        {this.getTeams().map((team, idx) =>
        {
          return (
            <React.Fragment key={'fragment' + idx}>
              <div className="tournament-team-list"
                key={'squad' + idx}
                style={{
                  'gridRow': 2 + idx,
                  'gridColumn': 1,
                  'backgroundColor': this.getPrizeColor(team.result),
                }}
              >
                {team.squad.map((player) =>
                {
                  return (
                    <p className="tournament-player-name"
                      key={player}
                    >
                      {player}
                    </p>
                  );
                },
                )}
              </div>
              <div className="tournament-result-cell"
                key={'result' + idx}
                style={{
                  'gridRow': 2 + idx,
                  'gridColumn': 2,
                  'backgroundColor': this.getPrizeColor(team.result),
                }}
              >
                <p className="tournament-result-number">{team.result}</p>
              </div>
            </React.Fragment>
          );
        },
        )}
      </div>
    );
  };
}


GetTournament.propTypes = {
  event: PropTypesUtils.EVENT_SCHEMA.isRequired,
};


const exportDefault = {
  GetTournament,
};
export default exportDefault;
