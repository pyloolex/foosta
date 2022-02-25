import React from 'react';

import PropTypesUtils from 'utils/PropTypes';

import 'components/events.css';
import 'components/matches.css';


/* eslint-disable require-jsdoc */
class GetMatch extends React.Component
{
  getTeams = () =>
  {
    return this.props.event.teams.sort(
        (a, b) =>
        {
          return b.result - a.result;
        },
    );
  };

  render()
  {
    const teams = this.getTeams();
    return (
      <div className="match-container">
        <div className="event-header match-header">
          <p>{this.props.event.date}</p>
        </div>

        <div className="first-team-list">
          {teams[0].squad.map((name) =>
            (
              <p className="match-player-name"
                key={name}
              >
                {name}
              </p>
            ),
          )}
        </div>

        <div className="match-score-cell">
          <p className="match-score-text">
            {teams[0].result +
             ':' +
             teams[1].result}
          </p>
        </div>

        <div className="second-team-list">
          {teams[1].squad.map((name) =>
            (
              <p className="match-player-name"
                key={name}
              >
                {name}
              </p>
            ),
          )}
        </div>
      </div>
    );
  };
}


GetMatch.propTypes = {
  event: PropTypesUtils.EVENT_SCHEMA.isRequired,
};


const exportDefault = {
  GetMatch,
};
export default exportDefault;
