import React, { useState, useEffect } from 'react';
//import ReactDOM from 'react-dom';
import './personal_page.css';
import { useParams } from 'react-router-dom';
import EloGraph from './EloGraph';
import Teammates from './Teammates';


const PersonalPage = props =>
{
  const { hero } = useParams();

  const [apiData, setApiData] = useState({
    'elo': [],
    'teammates': {},
    'rivals': {},
    'result_summary': {},
  });

  useEffect(() =>
    {
      fetch(`/api/stats/${hero}`).then(
        response => response.json()).then(
          responseJson =>
          {
            setApiData(responseJson);
            /*
            setApiData({
              ...apiData,
              'elo': [
                {
                  'date': '2021-02-04',
                  'event_number': 0,
                  'rating': 1250,
                  'result': 'W',
                },
                {
                  'date': '2021-02-05',
                  'event_number': 0,
                  'rating': 1250,
                  'result': 'W',
                },
                {
                  'date': '2021-02-04',
                  'event_number': 0,
                  'rating': 1250,
                  'result': 'W',
                }
              ],
            });
            */
          }
        );
    },
    [hero],
  );

  return (
    <div>
      <h1 className="personalpage__hero-name">{hero}</h1>
      <EloGraph.EloGraph elo={apiData.elo} />

      <label>Statistics</label>
      <select value="Teammates" onChange={()=>{}}>
        <option value="teammates">Teammates</option>
      </select>
      {/* Passing key so that the component rerenders
          after the hero is changed */}
      <Teammates.Teammates
        key={hero}
        teammates={apiData.teammates}
        resultSummary={apiData.result_summary}
      />
    </div>
  );
}


const export_default = {
  PersonalPage,
}
export default export_default;
