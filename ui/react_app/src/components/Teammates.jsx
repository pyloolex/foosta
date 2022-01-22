import React, { useEffect, useState } from 'react';
import './teammates.css'
import '../index.css';
import { Link } from 'react-router-dom';


const Teammates = props =>
{
  const MIN_PERC_TO_DRAW = 12;

  const [teammates, setTeammates] = useState({});
  const [resultSummary, setResultSummary] = useState({});
  const [sorting, setSorting] = useState([{
    column: 'match_result',
    order: -1,
  }]);

  useEffect(() =>
    {
      fetch(`/api/stats/${props.hero}`).then(
        response => response.json()).then(
          responseJson =>
          {
            setTeammates(responseJson['teammates']);
            setResultSummary(responseJson['result_summary']);
          }
        );
    },
    [props.hero],
  );

  const getSortingIcon = (columnName) =>
  {
    if (sorting[0].column === columnName)
    {
      if (sorting[0].order === 1)
      {
        return <img className="sorting-icon"
                    src="/sort_up.png"
                    alt="sort_up"
               />;
      }
      return <img className="sorting-icon"
                  src="/sort_down.png"
                  alt="sort_down"
             />;
    }
    return <img className="sorting-icon"
                src="/sortable.png"
                alt="sortable"
                style={{'opacity': 0.2}}
           />;
  }

  const handleHeaderClick = (columnName) =>
  {
    let pos = -1;
    for (let i = 0; i < sorting.length; i++)
    {
      if (sorting[i].column === columnName)
      {
        pos = i;
        break;
      }
    }

    let element;
    if (pos === -1)
    {
      element = {column: columnName, order: 1};
    }
    else
    {
      element = { ...sorting[pos] };
      element.order *= -1;
    }

    const newSorting = [element];
    for (let i = 0; i < sorting.length; i++)
    {
      if (i !== pos)
      {
        newSorting.push(sorting[i]);
      }
    }

    setSorting(newSorting);
  }

  const getPercent = (value, total) =>
  {
    if (value === 0) return 0;
    return value * 100 / total;
  }

  const drawPercent = (value, total) =>
  {
    const perc = getPercent(value, total);
    if (perc > 0)
    {
      return perc.toFixed(1);
    }
    return 0;
  }

  const drawSection = (value, total, className) =>
  {
    if (value === 0)
    {
      return null;
    }

    let content;
    if (value * 100 / total > MIN_PERC_TO_DRAW)
    {
      content = (value * 100 / total).toFixed(1);
    }
    else
    {
      content = '';
    }

    return (
      <div className={className}
           style={{"flex": `${value} ${value}`}}>
        {content}
      </div>
    );
  }

  const drawMatchChart = (data) =>
  {
    if (data.W + data.D + data.L === 0)
    {
      return null;
    }

    return (
      <React.Fragment>
        {drawSection(data.W, data.match, "teammates__w-section")}
        {drawSection(data.D, data.match, "teammates__d-section")}
        {drawSection(data.L, data.match, "teammates__l-section")}
      </React.Fragment>
    );
  }

  const drawTournamentChart = (data) =>
  {
    if (data['1'] + data['2'] + data['3'] + data['4+'] === 0)
    {
      return null;
    }

    return (
      <React.Fragment>
        {drawSection(data['1'], data.tournament, "teammates__1-section")}
        {drawSection(data['2'], data.tournament, "teammates__2-section")}
        {drawSection(data['3'], data.tournament, "teammates__3-section")}
        {drawSection(data['4+'], data.tournament, "teammates__4-section")}
      </React.Fragment>
    );
  }

  const sortTeammates = () =>
  {
    const data = [];
    for (let player in teammates)
    {
      const element = teammates[player];
      data.push({
        ...element,
        'name': player,

        'match_result': [
          getPercent(element['W'], element['match']),
          getPercent(element['D'], element['match']),
          getPercent(element['L'], element['match']),
        ],
        'tournament_result': [
          getPercent(element['1'], element['tournament']),
          getPercent(element['2'], element['tournament']),
          getPercent(element['3'], element['tournament']),
          getPercent(element['4+'], element['tournament']),
        ],

        'perc_W': getPercent(element['W'], resultSummary['W']),
        'perc_D': getPercent(element['D'], resultSummary['D']),
        'perc_L': getPercent(element['L'], resultSummary['L']),
        'perc_1': getPercent(element['1'], resultSummary['1']),
        'perc_2': getPercent(element['2'], resultSummary['2']),
        'perc_3': getPercent(element['3'], resultSummary['3']),
        'perc_4': getPercent(element['4+'], resultSummary['4+']),
      });
    }

    const compare = (a, b) =>
    {
      if (a.constructor === Array)
      {
        console.assert(b.constructor === Array && a.length === b.length);

        for (let i = 0; i < a.length; i++)
        {
          if (compare(a[i], b[i]) !== 0)
          {
            return compare(a[i], b[i]);
          }
        }

        return 0;
      }

      if (a === b)
      {
        return 0;
      }
      if (a > b)
      {
        return 1;
      }
      return -1;
    }

    data.sort((a, b) =>
      {
        for (let param of sorting)
        {
          const compared = compare(a[param.column], b[param.column]);
          if (compared !== 0)
          {
            return param.order * compared;
          }
        }
        return 0;
      }
    );

    return data;
  }

  const compileData = () =>
  {
    const response = []

    const sortedTeammates = sortTeammates();

    let idx = 1;
    for (let data of sortedTeammates)
    {
      // Foosta's base background color or a bit brighter.
      const rowColor = idx % 2 ? '#e3f5ff' : '#F0FFFB';
      response.push(
        <React.Fragment key={data.name}>
          <div className={"teammates__border-base "
                          + "teammates__border-u "
                          + "teammates__cell-data"}
               style={{'backgroundColor': rowColor}}>
          {idx}</div>
          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-name"}
               style={{'backgroundColor': rowColor}}>
            <p className="teammates__player-name">
              <Link className="player-name-link"
                    to={`/stats/${data.name}`}>
                {data.name}
              </Link>
            </p>
          </div>
          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-data"}
               style={{'backgroundColor': rowColor}}>
          {data.events}</div>
          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-data"}
               style={{'backgroundColor': rowColor}}>
          {data.match}</div>

          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-data "
                          + "teammates__match-chart"}
               style={{'backgroundColor': rowColor}}>
            {drawMatchChart(data)}
          </div>

          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-data"}
               style={{'backgroundColor': rowColor}}>
            {drawPercent(data.W, resultSummary.W)}
          </div>
          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-data"}
               style={{'backgroundColor': rowColor}}>
            {drawPercent(data.D, resultSummary.D)}
          </div>
          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-data"}
               style={{'backgroundColor': rowColor}}>
            {drawPercent(data.L, resultSummary.L)}
          </div>
          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-data"}
               style={{'backgroundColor': rowColor}}>{data.tournament}</div>
          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-data "
                          + "teammates__tournament-chart"}
               style={{'backgroundColor': rowColor}}>
            {drawTournamentChart(data)}
          </div>
          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-data"}
               style={{'backgroundColor': rowColor}}>
            {drawPercent(data['1'], resultSummary['1'])}
          </div>
          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-data"}
               style={{'backgroundColor': rowColor}}>
            {drawPercent(data['2'], resultSummary['2'])}
          </div>
          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-data"}
               style={{'backgroundColor': rowColor}}>
            {drawPercent(data['3'], resultSummary['3'])}
          </div>
          <div className={"teammates__border-base "
                          + "teammates__border-corner "
                          + "teammates__cell-data"}
               style={{'backgroundColor': rowColor}}>
            {drawPercent(data['4+'], resultSummary['4+'])}
          </div>
        </React.Fragment>
      );

      idx++;
    }

    return response;
  }

  return (
    <div className="teammates__container">
      <div className={"teammates__empty-header "
                      + "teammates__border-base "
                      + "teammates__border-full "
                      + "teammates__header"}></div>
      <div className={"teammates__common-header "
                      + "teammates__border-base "
                      + "teammates__border-moon "
                      + "teammates__header"}></div>
      <div className={"teammates__matches-header "
                      + "teammates__border-base "
                      + "teammates__border-moon "
                      + "teammates__header"}>
      Matches</div>
      <div className={"teammates__tournaments-header "
                      + "teammates__border-base "
                      + "teammates__border-moon "
                      + "teammates__header"}>
      Tournaments</div>

      <div className={"teammates__n-header "
                      + "teammates__border-base "
                      + "teammates__border-u "
                      + "teammates__header"}>N</div>
      <div className={"teammates__name-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('name')}>
        <div>
          Name
          {getSortingIcon('name')}
        </div>
      </div>
      <div className={"teammates__events-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('events')}>
        <div>
          #
          {getSortingIcon('events')}
        </div>
      </div>
      <div className={"teammates__match-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('match')}>
        <div>
          #
          {getSortingIcon('match')}
        </div>
      </div>
      <div className={"teammates__mchart-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('match_result')}>
        <div>
          Result
          {getSortingIcon('match_result')}
        </div>
      </div>
      <div className={"teammates__w-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('perc_W')}>
        <div>
          W
          {getSortingIcon('perc_W')}
        </div>
      </div>
      <div className={"teammates__d-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('perc_D')}>
        <div>
          D
          {getSortingIcon('perc_D')}
        </div>
      </div>
      <div className={"teammates__l-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('perc_L')}>
        <div>
          L
          {getSortingIcon('perc_L')}
        </div>
      </div>
      <div className={"teammates__tournament-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('tournament')}>
        <div>
          #
          {getSortingIcon('tournament')}
        </div>
      </div>
      <div className={"teammates__tchart-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('tournament_result')}>
        <div>
          Result
          {getSortingIcon('tournament_result')}
        </div>
      </div>
      <div className={"teammates__g-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('perc_1')}>
        <div>
          1
          {getSortingIcon('perc_1')}
        </div>
      </div>
      <div className={"teammates__s-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('perc_2')}>
        <div>
          2
          {getSortingIcon('perc_2')}
        </div>
      </div>
      <div className={"teammates__b-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('perc_3')}>
        <div>
          3
          {getSortingIcon('perc_3')}
        </div>
      </div>
      <div className={"teammates__e-header "
                      + "teammates__border-base "
                      + "teammates__border-corner "
                      + "teammates__header "
                      + "sortable-header"}
           onClick={() => handleHeaderClick('perc_4')}>
        <div>
          4+
          {getSortingIcon('perc_4')}
        </div>
      </div>

      {compileData()}
    </div>
  );
}


const export_default = {
  Teammates,
}
export default export_default;
