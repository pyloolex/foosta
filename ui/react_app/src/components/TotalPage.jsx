import React, {useState, useEffect} from 'react';
import * as ReactRouterDom from 'react-router-dom';

import Goals from 'components/Goals';
import Legends from 'components/Legends';
import MainStat from 'components/MainStat';
import Streaks from 'components/Streaks';
import Utils from 'utils/utils';

import 'index.css';


const POSSIBLE_CHOSEN_VALUES = new Set(['main', 'streaks', 'goals']);


const TotalPage = (props) =>
{
  const getChosenTable = () =>
  {
    if (chosen === 'main')
    {
      return <React.Fragment>
        <MainStat.MainStat
          total={apiData.total}
          searchParamsEntries={searchParamsEntries}
          setSearchParams={setSearchParams}
        />
        <Legends.Main />
      </React.Fragment>;
    }
    if (chosen === 'streaks')
    {
      return <React.Fragment>
        <Streaks.Streaks
          streaks={apiData.streaks}
          searchParamsEntries={searchParamsEntries}
          setSearchParams={setSearchParams}
        />
        <Legends.Streaks />
      </React.Fragment>;
    }
    console.assert(chosen === 'goals');
    return <React.Fragment>
      <Goals.Goals
        goals={apiData.goals}
        searchParamsEntries={searchParamsEntries}
        setSearchParams={setSearchParams}
      />
      <Legends.Goals />
    </React.Fragment>;
  };

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
        (response) => response.json()).then(
        (responseJson) =>
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
        },
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
};


let proxyKey;

const TotalPageProxy = (props) =>
{
  // This proxy is needed in order to handle search params reset.
  // When a user clicks on "Stats" button or on a Foosta logo,
  // he gets to the "/" location without search params.
  //
  // By default, the component doesn't get remounted. It leads
  // to the search params and component properties being out of sync.
  //
  // In order to handle that, let's change component's key every time
  // the search params get reset to empty dict.
  //
  // Notice that when a user changes sorting order or stat type, the
  // component shouldn't be remounted. That's why the key should be
  // preserved in that cases.
  const [searchParams, _] = ReactRouterDom.useSearchParams();
  const searchParamsEntries = Object.fromEntries(searchParams.entries());

  if (Object.keys(searchParamsEntries).length === 0)
  {
    proxyKey = Math.random();
  }

  return <TotalPage key={proxyKey} {...props} />;
};


const exportDefault =
{
  TotalPageProxy,
};
export default exportDefault;
