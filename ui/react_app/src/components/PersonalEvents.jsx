import React, { useRef, useEffect } from 'react';
import './personal_events.css';
import '../index.css';


const PersonalEvents = (props) =>
{
  const compileData = () =>
  {
    const getBackgroundColor = (x) =>
    {
      // Slightly blue or Foosta's base color.
      return x === props.hovered ? '#E3F5FF' : '#F0FFFB';
    }
    const drawRatingField = (idx) =>
    {
      let diff = null;
      if (idx > 0)
      {
        diff = props.elo[idx].rating - props.elo[idx - 1].rating;
      }
      else
      {
        diff = props.elo[idx].rating - 1200;
      }

      let strDiff = diff.toString();
      if (diff >= 0)
      {
        strDiff = '+' + strDiff;
      }

      return props.elo[idx].rating + ' (' + strDiff + ')';
    }

    const response = [];

    for (let i = 0; i < props.elo.length; i++)
    {
      const event = props.elo[i];
      if (event.result === null)
      {
        continue;
      }

      response.push(
        <React.Fragment key={event.date+event.event_number}>
          <div className={"pevents__data-cell "
                          + "border1-rd "
                          + "border1-base "}
               style={{'backgroundColor': getBackgroundColor(i)}}
               onMouseOver={(event) => props.setHovered(i)}
          >
            {i + 1}
          </div>
          <div className={"pevents__data-cell "
                          + "border1-rd "
                          + "border1-base "}
               style={{'backgroundColor': getBackgroundColor(i)}}
               onMouseOver={(event) => props.setHovered(i)}
          >
            {event.date}
          </div>
          <div className={"pevents__data-cell "
                          + "border1-rd "
                          + "border1-base "}
               style={{'backgroundColor': getBackgroundColor(i)}}
               onMouseOver={(event) => props.setHovered(i)}
          >
            {event.result}
          </div>
          <div className={"pevents__data-cell "
                          + "border1-d "
                          + "border1-base "}
               style={{'backgroundColor': getBackgroundColor(i)}}
               onMouseOver={(event) => props.setHovered(i)}
          >
            {drawRatingField(i)}
          </div>
        </React.Fragment>
      );
    }

    return response;
  }

  const lineRefs = useRef({});

  useEffect(() =>
    {
      if (props.scrolled === -1 || props.scrolled >= props.elo.length)
      {
        return;
      }

      let idx = 0;
      for (let i = 0; i < Math.min(props.elo.length, props.scrolled); i++)
      {
        if (props.elo[i].result !== null)
        {
          idx++;
        }
      }

      if (props.elo[props.scrolled].result !== null)
      {
        lineRefs.current.scrollTo({top: (idx - 4) * 30});
      }
    },
    [props.scrolled, props.elo],
  )

  return (
    <div className="pevents__container">
      <div className="pevents__container-header">
        <div className={"pevents__header "
                        + "border1-base "
                        + "pevents__N-header "}>
          N
        </div>
        <div className={"pevents__header "
                        + "border1-base "
                        + "pevents__date-header "}>
          Date
        </div>
        <div className={"pevents__header "
                        + "border1-base "
                        + "pevents__result-header "}>
          Result
        </div>
        <div className={"pevents__header "
                        + "border1-base "
                        + "pevents__elo-header "}>
          Elo
        </div>
      </div>
      <div className="pevents__container-data"
           ref={ref => lineRefs.current = ref}
      >
        {compileData()}
      </div>
    </div>
  );
}

const export_default = {
  PersonalEvents,
}
export default export_default;
