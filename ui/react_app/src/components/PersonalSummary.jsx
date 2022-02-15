import React from 'react';
import Utils from '../utils/utils';

import './personal_summary.css';
import '../index.css';


const PersonalSummary = (props) =>
{
  const rating = (
    props.elo.length > 0 ?
      props.elo[props.elo.length - 1].rating : null
  );

  return (
    <div className="psummary__container">
      <div className={"border-solid-black " +
                      "border-1111 " +
                      "font-20 " +
                      "font-bold " +
                      "grid-content-center "}
      >#e</div>
      <div className={"border-solid-black " +
                      "border-1110 " +
                      "font-20 " +
                      "font-bold " +
                      "grid-content-center "}
      >#m</div>
      <div className={"border-solid-black " +
                      "border-1110 " +
                      "font-20 " +
                      "font-bold " +
                      "grid-content-center "}
      >W</div>
      <div className={"border-solid-black " +
                      "border-1110 " +
                      "font-20 " +
                      "font-bold " +
                      "grid-content-center "}
      >D</div>
      <div className={"border-solid-black " +
                      "border-1110 " +
                      "font-20 " +
                      "font-bold " +
                      "grid-content-center "}
      >L</div>
      <div className={"border-solid-black " +
                      "border-1110 " +
                      "font-20 " +
                      "font-bold " +
                      "grid-content-center "}
      >#t</div>
      <div className={"border-solid-black " +
                      "border-1110 " +
                      "font-20 " +
                      "font-bold " +
                      "grid-content-center "}
      >1</div>
      <div className={"border-solid-black " +
                      "border-1110 " +
                      "font-20 " +
                      "font-bold " +
                      "grid-content-center "}
      >2</div>
      <div className={"border-solid-black " +
                      "border-1110 " +
                      "font-20 " +
                      "font-bold " +
                      "grid-content-center "}
      >3</div>
      <div className={"border-solid-black " +
                      "border-1110 " +
                      "font-20 " +
                      "font-bold " +
                      "grid-content-center "}
      >4+</div>
      <div className={"border-solid-black " +
                      "border-1110 " +
                      "font-20 " +
                      "font-bold " +
                      "grid-content-center "}
      >Elo</div>


      <div className={"border-solid-black " +
                      "border-0111 " +
                      "font-20 " +
                      "grid-content-center "}
      >{props.resultSummary['events']}</div>
      <div className={"border-solid-black " +
                      "border-0110 " +
                      "font-20 " +
                      "grid-content-center "}
      >{props.resultSummary['match']}</div>
      <div className={"border-solid-black " +
                      "border-0110 " +
                      "font-20 " +
                      "grid-content-center "}
      >{props.resultSummary['W']}</div>
      <div className={"border-solid-black " +
                      "border-0110 " +
                      "font-20 " +
                      "grid-content-center "}
      >{props.resultSummary['D']}</div>
      <div className={"border-solid-black " +
                      "border-0110 " +
                      "font-20 " +
                      "grid-content-center "}
      >{props.resultSummary['L']}</div>
      <div className={"border-solid-black " +
                      "border-0110 " +
                      "font-20 " +
                      "grid-content-center "}
      >{props.resultSummary['tournament']}</div>
      <div className={"border-solid-black " +
                      "border-0110 " +
                      "font-20 " +
                      "grid-content-center "}
      >{props.resultSummary['1']}</div>
      <div className={"border-solid-black " +
                      "border-0110 " +
                      "font-20 " +
                      "grid-content-center "}
      >{props.resultSummary['2']}</div>
      <div className={"border-solid-black " +
                      "border-0110 " +
                      "font-20 " +
                      "grid-content-center "}
      >{props.resultSummary['3']}</div>
      <div className={"border-solid-black " +
                      "border-0110 " +
                      "font-20 " +
                      "grid-content-center "}
      >{props.resultSummary['4+']}</div>
      <div className={"border-solid-black " +
                      "border-0110 " +
                      "font-20 " +
                      "grid-content-center "}
           style={{'backgroundColor': Utils.getEloColor(rating)}}
      >{rating}</div>
    </div>
  );
}


const export_default = {
  PersonalSummary,
}
export default export_default;
