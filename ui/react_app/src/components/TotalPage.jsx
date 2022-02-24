import React, { useState, useEffect } from 'react';
import * as ReactRouterDom from 'react-router-dom';

import MainStat from './MainStat';
import Utils from '../utils/utils';

import '../index.css';


const POSSIBLE_CHOSEN_VALUES = new Set(['main', 'streaks', 'goals']);


const TotalPage = props =>
{
  const getChosenTable = () =>
  {
    if (chosen === 'main')
    {
      return <MainStat.MainStat total={apiData.total}
                                searchParams={searchParamsEntries}
                                setSearchParams={setSearchParams}
             />;
    }
    if (chosen === 'streaks')
    {
      //return <Streaks.Streaks />;
      return <h1>Streaks</h1>;
    }
    //console.assert(chosen === 'goals');
    //return <Goals.Goals />;
    return <h1>Goals</h1>
  }

  const [searchParams, setSearchParams] = ReactRouterDom.useSearchParams();
  const searchParamsEntries = Object.fromEntries(searchParams.entries());

  const [chosen, setChosen] = useState(Utils.obtainInitialChosen(
    searchParamsEntries, 'main', POSSIBLE_CHOSEN_VALUES));
  const [apiData, setApiData] = useState({
    'total': {},
    'streaks': {},
    'goals': {},
  });

  useEffect(() =>
    {
      fetch(`/api/stats`).then(
        response => response.json()).then(
          responseJson =>
          {
            setApiData(responseJson);

            /*
            setApiData({
              ...responseJson,
              'total': {
                'do': {
                  'events': 1,
                  'match': 0,
                  'tournament': 0,
                  'W': 0,
                  'D': 0,
                  'L': 0,
                  '1': 0,
                  '2': 0,
                  '3': 0,
                  '4+': 0,
                  'elo': 1950,
                },
              },
            });
            */
          }
        );
    },
    [],
  );

  return (
    <React.Fragment>
      <div className="statistics-select-holder">
        <label className="statistics-label">Statistics: </label>
        <select className="statistics-select"
                value={chosen}
                onChange={(event) => Utils.handleChosenChange(
                  setChosen, setSearchParams, event.target.value)}
        >
          <option value="main">Main</option>
          <option value="streaks">Streaks</option>
          <option value="goals">Goals</option>
        </select>
      </div>
      {getChosenTable()}
    </React.Fragment>
  );
}


const export_default = {
  TotalPage,
}
export default export_default;
