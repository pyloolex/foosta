import React from 'react';
//import ReactDOM from 'react-dom';
import './personal_page.css';
import { useParams } from 'react-router-dom';
import Teammates from './Teammates';


const PersonalPage = props =>
{
  const { hero } = useParams();

  return (
    <div>
      <h1>{hero}</h1>

      <label>Statistics</label>
      <select value="Teammates" onChange={()=>{}}>
        <option value="teammates">Teammates</option>
      </select>
      {/* Passing key so that the component rerenders
          after the hero is changed */}
      <Teammates.Teammates key={hero} hero={hero} />
    </div>
  );
}


const export_default = {
  PersonalPage,
}
export default export_default;
