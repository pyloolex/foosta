import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import * as ReactRouterDom from 'react-router-dom';

import CrossPlayerInteractions from 'components/CrossPlayerInteractions';
import EloGraph from './EloGraph';
import PersonalEvents from './PersonalEvents';
import PersonalSummary from './PersonalSummary';

import Utils from 'utils/utils';

import './personal_page.css';
import '../index.css';


const POSSIBLE_CHOSEN_VALUES = new Set(['teammates', 'rivals']);


const PersonalPage = (props) =>
{
  const getChosenTable = () =>
  {
    let playerData;
    if (chosen === 'teammates')
    {
      playerData = apiData.teammates;
    }
    else
    {
      console.assert(chosen === 'rivals');
      playerData = apiData.rivals;
    }

    return <CrossPlayerInteractions.CrossPlayerInteractions
      key={props.hero + chosen}
      playerData={playerData}
      resultSummary={apiData.result_summary}
      searchParamsEntries={searchParamsEntries}
      setSearchParams={setSearchParams}
    />;
  };

  const [apiData, setApiData] = useState({
    'elo': [],
    'teammates': {},
    'rivals': {},
    'result_summary': {},
  });

  const [hovered, setHovered] = useState(-1);
  const [scrolled, setScrolled] = useState(-1);

  const [searchParams, setSearchParams] = ReactRouterDom.useSearchParams();
  const searchParamsEntries = Object.fromEntries(searchParams.entries());

  const [chosen, setChosen] = useState(Utils.obtainInitialChosen(
      searchParamsEntries, 'teammates', POSSIBLE_CHOSEN_VALUES));

  useEffect(() =>
  {
    fetch(`/api/stats/${props.hero}`).then(
        (response) => response.json()).then(
        (responseJson) =>
        {
          setApiData(responseJson);

          // setScrolled(1000);

          /*
            setApiData({
              ...apiData,
              'elo': [
                {
                  'date': '2021-02-04',
                  'event_number': 0,
                  'rating': 1700,
                  'result': 'W',
                },
                {
                  'date': '2021-02-04',
                  'event_number': 0,
                  'rating': 1600,
                  'result': 'W',
                },
                {
                  'date': '2021-02-05',
                  'event_number': 0,
                  'rating': 1000,
                  'result': 'W',
                },
                {
                  'date': '2021-02-04',
                  'event_number': 0,
                  'rating': 1010,
                  'result': 'W',
                }
              ],
            });
            */

          /*
            setApiData({
              ...responseJson,
              'result_summary': {
                'events': 13,
                'match': 0,
                'tournament': 13,
                'W': 0,
                'D': 0,
                'L': 0,
                '1': 2,
                '2': 3,
                '3': 6,
                '4+': 2,
              },
              'teammates': {
                'Fred': {
                  'events': 4,
                  'match': 0,
                  'tournament': 4,
                  'W': 0,
                  'D': 0,
                  'L': 0,
                  '1': 1,
                  '2': 1,
                  '3': 1,
                  '4+': 1,
                },
              },
            });
            */
        },
    );
    window.scrollTo(0, 0);
  },
  [props.hero],
  );

  return (
    <div>
      <h1 className="personalpage__hero-name">{props.hero}</h1>
      <PersonalSummary.PersonalSummary
        elo={apiData.elo}
        resultSummary={apiData.result_summary}
      />
      <EloGraph.EloGraph elo={apiData.elo}
        hovered={hovered}
        setHovered={setHovered}
        setScrolled={setScrolled}
      />
      <PersonalEvents.PersonalEvents elo={apiData.elo}
        hovered={hovered}
        setHovered={setHovered}
        scrolled={scrolled}
        setScrolled={setScrolled}
      />

      <div className="statistics-select-holder">
        <label className="statistics-label">Statistics: </label>
        <select
          className="statistics-select"
          value={chosen}
          onChange={(event) => Utils.handleChosenChange(
              setChosen, setSearchParams, event.target.value)}
        >
          <option value="teammates">Teammates</option>
          <option value="rivals">Rivals</option>
        </select>
      </div>
      {getChosenTable()}
    </div>
  );
};


PersonalPage.propTypes = {
  hero: PropTypes.string.isRequired,
};


const PersonalPageProxy = (props) =>
{
  const {hero} = ReactRouterDom.useParams();
  // Passing key so that the component rerenders
  // after the hero is changed.
  return <PersonalPage key={hero} hero={hero} {...props} />;
};


const exportDefault =
{
  PersonalPageProxy,
};
export default exportDefault;
