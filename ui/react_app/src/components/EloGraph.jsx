import React from 'react';
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
  const calcY = (rating) =>
  {
    return MAIN_AREA_HEIGHT - (rating - minValShifted) * resizeCoef;
  }

  const drawLinePath = () =>
  {
    const calcX = (step) =>
    {
      return step * MAIN_AREA_WIDTH / MAX_EVENT_COUNT;
    }

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

      response.push(
        <circle cx={x} cy={y} r="2" key={'point_' + i} />
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

  const calcColorFromRating = (rating) =>
  {
    if (rating < 1000)
    {
      return '#CCCCCC';
    }
    if (rating < 1100)
    {
      return '#AAFFAA';
    }
    if (rating < 1200)
    {
      return '#AACCFF';
    }
    if (rating < 1300)
    {
      return '#DDAAFF';
    }
    if (rating < 1400)
    {
      return '#FFAA66';
    }

    return '#FF8888';
  }

  const drawColorRect = (low, high) =>
  {
    return (
      <rect x="0" y={calcY(high)}
            width={MAIN_AREA_WIDTH} height={calcY(low) - calcY(high)}
            fill={calcColorFromRating(low)}
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
    for (let i = 1; i < 6; i++)
    {
      const x = i * MAIN_AREA_WIDTH / 6;
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
    const step = MAIN_AREA_WIDTH / 6;

    return (
      <React.Fragment>
        <text x={MAIN_AREA_MARGIN_HORIZONTAL + step * 1 - 30} y={y}
              fontSize="20px"
        >
          March
        </text>
        <text x={MAIN_AREA_MARGIN_HORIZONTAL + step * 2 - 22} y={y}
              fontSize="20px"
        >
          May
        </text>
        <text x={MAIN_AREA_MARGIN_HORIZONTAL + step * 3 - 17} y={y}
              fontSize="20px"
        >
          July
        </text>
        <text x={MAIN_AREA_MARGIN_HORIZONTAL + step * 4 - 40} y={y}
              fontSize="20px"
        >
          September
        </text>
        <text x={MAIN_AREA_MARGIN_HORIZONTAL + step * 5 - 42} y={y}
              fontSize="20px"
        >
          November
        </text>
      </React.Fragment>
    );
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
                      `${MAIN_AREA_MARGIN_VERTICAL})`}>
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
