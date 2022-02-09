import React, { useState, useEffect } from 'react';
//import ReactDOM from 'react-dom';
import './personal_page.css';
import { useParams } from 'react-router-dom';
import EloGraph from './EloGraph';
import PersonalEvents from './PersonalEvents';
import PersonalSummary from './PersonalSummary';
import Teammates from './Teammates';


const PersonalPage = props =>
{
  // Pass `hero` as a prop here.
  const { hero } = useParams();

  const [apiData, setApiData] = useState({
    'elo': [],
    'teammates': {},
    'rivals': {},
    'result_summary': {},
  });

  const [hovered, setHovered] = useState(-1);
  const [scrolled, setScrolled] = useState(-1);

  useEffect(() =>
    {
      fetch(`/api/stats/${hero}`).then(
        response => response.json()).then(
          responseJson =>
          {
            setApiData(responseJson);

            //setScrolled(1000);

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
      window.scrollTo(0, 0);
    },
    [hero],
  );

  return (
    <div>
      <h1 className="personalpage__hero-name">{hero}</h1>
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

      <label>Statistics</label>
      <select value="Teammates" onChange={()=>{}}>
        <option value="teammates">Teammates</option>
      </select>
      <Teammates.Teammates
        key={hero}
        teammates={apiData.teammates}
        resultSummary={apiData.result_summary}
      />
    </div>
  );
}


const PersonalPageProxy = (props) =>
{
  const { hero } = useParams();
  // Passing key so that the component rerenders
  // after the hero is changed.
  return <PersonalPage key={hero} {...props} />;
}


const export_default = {
  PersonalPageProxy,
}
export default export_default;
