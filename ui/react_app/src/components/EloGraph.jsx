import React from 'react';
import Utils from '../utils/utils';

import './elo_graph.css'


const INF = 1e9;

const MAIN_AREA_HEIGHT = 344;
const MAIN_AREA_MARGIN_HORIZONTAL = 54;
const MAIN_AREA_MARGIN_VERTICAL = 27;
const MAIN_AREA_WIDTH = 1250;
const MAX_EVENT_COUNT = 100;
const MINMAX_MARGIN = 50;


const EloGraph = (props) =>
{
  const calcX = (step) =>
  {
    return step * MAIN_AREA_WIDTH / MAX_EVENT_COUNT;
  }
  const calcY = (rating) =>
  {
    return MAIN_AREA_HEIGHT - (rating - minValShifted) * resizeCoef;
  }

  const drawLinePath = () =>
  {
    const response = [];
    let lastX = null;
    let lastY = null;
    for (let i = 0; i < props.elo.length; i++)
    {
      if (props.elo[i].result === null)
      {
        continue;
      }

      const x = calcX(i);
      const y = calcY(props.elo[i].rating);
      const radius = i === props.hovered ? 4 : 2;

      response.push(
        <circle cx={x} cy={y} r={radius} key={'point_' + i} />
      );

      if (lastX !== null)
      {
        response.push(
          <line key={'line_' + i}
                x1={lastX} y1={lastY} x2={x} y2={y}
                stroke="black"
                strokeWidth="2"
          />
        );
      }

      lastX = x;
      lastY = y;
    }

    return response;
  }

  const calcMinMax = () =>
  {
    let minVal = INF;
    let maxVal = -INF;
    for (let i = 0; i < props.elo.length; i++)
    {
      const rating = props.elo[i].rating;
      minVal = Math.min(minVal, rating);
      maxVal = Math.max(maxVal, rating);
    }

    const minValShifted = minVal - MINMAX_MARGIN;
    const maxValShifted = maxVal + MINMAX_MARGIN;
    const resizeCoef = MAIN_AREA_HEIGHT / (maxValShifted - minValShifted);

    return [minValShifted, maxValShifted, resizeCoef];
  }

  const getPartitionNumbers = () => {
    const response = [];
    for (let num = Math.ceil((minValShifted + 1) / 100) * 100;
         num < maxValShifted; num += 100)
    {
      response.push(num);
    }
    return response;
  }

  const drawColorPartitions = () => {
    const response = [];
    for (let i = 0; i < partitionNumbers.length; i++)
    {
      const num = partitionNumbers[i];
      const y = calcY(num);

      response.push(
        <line
          x1="0" y1={y} x2={MAIN_AREA_WIDTH} y2={y}
          stroke="black"
          strokeOpacity="0.3"
          key={num}
        />
      );
    }
    return response;
  }

  const drawPartitionNumbers = () =>
  {
    const response = [];
    for (let i = 0; i < partitionNumbers.length; i++)
    {
      const num = partitionNumbers[i];
      response.push(
        <text x="7" y={calcY(num) + MAIN_AREA_MARGIN_VERTICAL + 7}
              fontSize="20px"
              key={num}
        >
          {num}
        </text>
      );
    }
    return response;
  }

  const drawColorRect = (low, high) =>
  {
    return (
      <rect x="0" y={calcY(high)}
            width={MAIN_AREA_WIDTH} height={calcY(low) - calcY(high)}
            fill={Utils.getEloColor(low)}
            key={low} />
    );
  }

  const drawColorRectangles = () =>
  {
    if (partitionNumbers.length === 0)
    {
      if (props.elo.length === 0)
      {
        // If the HTTP request hasn't been completed yet. Just show the empty
        // chart.
        return null;
      }

      return drawColorRect(minValShifted, maxValShifted);
    }

    const response = [];
    const firstRectangle = drawColorRect(minValShifted, partitionNumbers[0]);
    response.push(firstRectangle);

    for (let i = 1; i < partitionNumbers.length; i++)
    {
      response.push(
        drawColorRect(partitionNumbers[i - 1], partitionNumbers[i])
      );
    }

    response.push(
      drawColorRect(
        partitionNumbers[partitionNumbers.length - 1], maxValShifted)
    );

    return response;
  }

  const drawMonthLines = () =>
  {
    const response = [];
    for (let i = 1; i < 4; i++)
    {
      const x = calcX(i * 25 - 1);
      response.push(
        <line x1={x} y1="0" x2={x} y2={MAIN_AREA_HEIGHT}
              stroke="black" strokeDasharray= "6 6"
              strokeOpacity="0.5"
              key={i}
        />
      );
    }
    return response;
  }

  const drawMonthNames = () =>
  {
    const y = MAIN_AREA_MARGIN_VERTICAL + MAIN_AREA_HEIGHT + 20;

    return (
      <React.Fragment>
        <text x={MAIN_AREA_MARGIN_HORIZONTAL + calcX(24) - 10} y={y}
              fontSize="20px"
        >
          25
        </text>
        <text x={MAIN_AREA_MARGIN_HORIZONTAL + calcX(49) - 10} y={y}
              fontSize="20px"
        >
          50
        </text>
        <text x={MAIN_AREA_MARGIN_HORIZONTAL + calcX(74) - 10} y={y}
              fontSize="20px"
        >
          75
        </text>
      </React.Fragment>
    );
  }

  const handleHover = (event) =>
  {
    const bounds = event.currentTarget.getBoundingClientRect();
    const eventX = event.clientX - bounds.left;
    const idx = Math.round(eventX / (MAIN_AREA_WIDTH / MAX_EVENT_COUNT));
    console.assert(idx >= 0);
    props.setHovered(idx);
    props.setScrolled(idx);
  }

  const handleNoHover = (event) =>
  {
    props.setHovered(-1);
    props.setScrolled(-1);
  }

  const [minValShifted, maxValShifted, resizeCoef] = calcMinMax();
  const partitionNumbers = getPartitionNumbers();

  return (
    <div className="elograph__container">
      <svg width="100%" height="100%"
      >
        {drawPartitionNumbers()}
        {drawMonthNames()}

        <g transform={`translate(${MAIN_AREA_MARGIN_HORIZONTAL},` +
                      `${MAIN_AREA_MARGIN_VERTICAL})`}
           onMouseMove={handleHover}
           onMouseOut={handleNoHover}
        >
          {drawColorRectangles()}
          {drawColorPartitions()}
          {drawMonthLines()}

          {drawLinePath()}
        </g>

        <rect x={MAIN_AREA_MARGIN_HORIZONTAL} y={MAIN_AREA_MARGIN_VERTICAL}
              width={MAIN_AREA_WIDTH} height={MAIN_AREA_HEIGHT}
              fill="none" stroke="black"
        />

      </svg>
    </div>
  );
}


const export_default = {
  EloGraph,
}
export default export_default;
