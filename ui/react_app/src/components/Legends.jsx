import PropTypes from 'prop-types';
import React from 'react';

import './legends.css';


/* eslint-disable react/no-unescaped-entities */

const CrossPlayerInteractions = (props) =>
{
  const withVersus = (props.chosen === 'teammates') ? 'with' : 'versus';
  const withVersusLong = (props.chosen === 'teammates') ?
        'with him in one team ' : 'versus him ';

  return (
    <div className="legends__container legends__container-cpi">
      <div className="legends__content">
        <span className="legends__bold-header">#</span> :
        Number of events the player has participated in. <br />
        <span className="legends__bold-header">Result</span> :
        When "{props.hero}" plays {withVersus} this teammate,
        he (green=wins, grey=draws, red=loses) in the following percent
        of matches.<br />
        <span className="legends__bold-header">W</span> :
        When "{props.hero}" wins, this teammate plays {withVersusLong}
        in the following percent of matches. <br />
        <span className="legends__bold-header">D</span> :
        When "{props.hero}" draws, this teammate plays {withVersusLong}
        in the following percent of matches. <br />
        <span className="legends__bold-header">L</span> :
        When "{props.hero}" loses, this teammate plays {withVersusLong}
        in the following percent of matches. <br />
        <span className="legends__bold-header">Result</span> :
        When "{props.hero}" plays {withVersus} this teammate,
        he takes the (yellow=1, grey=2, brown=3, white=4+) place in
        the tournament.<br />

        <span className="legends__bold-header">1</span> :
        When "{props.hero}" takes the first place in a tournament,
        this teammate plays {withVersusLong}
        in the following percent of cases. <br />
        <span className="legends__bold-header">2</span> :
        When "{props.hero}" takes the second place in a tournament,
        this teammate plays {withVersusLong}
        in the following percent of cases. <br />
        <span className="legends__bold-header">3</span> :
        When "{props.hero}" takes the third place in a tournament,
        this teammate plays {withVersusLong}
        in the following percent of cases. <br />
        <span className="legends__bold-header">4</span> :
        When "{props.hero}" takes the 4+ place in a tournament,
        this teammate plays {withVersusLong}
        in the following percent of cases. <br />
      </div>
    </div>
  );
};
CrossPlayerInteractions.propTypes =
{
  chosen: PropTypes.string.isRequired,
  hero: PropTypes.string.isRequired,
};


const Goals = (props) =>
{
  return (
    <div className="legends__container legends__container-goals">
      <div className="legends__content">
        <span className="legends__bold-header">Scored</span> :
        Number of goals the player's team has scored. <br />
        <span className="legends__bold-header">Scored</span> :
        Number of goals the player's team has conceded. <br />
        <span className="legends__bold-header">Diff</span> :
        Difference between scored and conceded. <br />
      </div>
    </div>
  );
};


const Main = (props) =>
{
  return (
    <div className="legends__container legends__container-main">
      <div className="legends__content">
        <span className="legends__bold-header">#</span> :
        Number of events the player has participated in. <br />
        <span className="legends__bold-header">Elo</span> :
        Very basic version of Elo Rating System with the constant values
        K=32 and exponent denominator 400. <br />
        <span className="legends__bold-header">W</span> :
        Number of wins. <br />
        <span className="legends__bold-header">D</span> :
        Number of draws. <br />
        <span className="legends__bold-header">L</span> :
        Number of losses. <br />
        <span className="legends__bold-header">%W</span> :
        Percent of wins. <br />
        <span className="legends__bold-header">Pts</span> :
        Number of points in matches (win=3, draw=1). <br />
        <span className="legends__bold-header">1</span> :
        Number of the first places in tournaments. <br />
        <span className="legends__bold-header">2</span> :
        Number of the seconds places in tournaments. <br />
        <span className="legends__bold-header">3</span> :
        Number of the third places in tournaments. <br />
        <span className="legends__bold-header">4</span> :
        Number of the tournaments where the player's team didn't make it
        into the top 3. <br />
      </div>
    </div>
  );
};


const Streaks = (props) =>
{
  return (
    <div className="legends__container legends__container-streaks">
      <div className="legends__content">
        <span className="legends__bold-header">Events</span> :
        Number of events the player participated in without
        skipping in a row. <br />
        <span className="legends__bold-header">Wins</span> :
        Number of matches won in a row. <br />
        <span className="legends__bold-header">No wins</span> :
        Number of matches the player couldn't win in a row. <br />
        <span className="legends__bold-header">Gold</span> :
        Number of tournaments won in a row. <br />
        <span className="legends__bold-header">No gold</span> :
        Number of tournaments the player couldn't win in a row. <br />
      </div>
    </div>
  );
};


const exportDefault =
{
  CrossPlayerInteractions,
  Goals,
  Main,
  Streaks,
};
export default exportDefault;
