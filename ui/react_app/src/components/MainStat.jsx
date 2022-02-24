import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import SortingUtils from '../utils/Sorting';
import Utils from '../utils/utils';

import '../index.css';
import './main_stat.css'


const DEFAULT_SORTING = [{column: 'elo', order: -1}];
const POSSIBLE_SORT_VALUES = new Set([
  'name',
  'events', 'elo',
  'match', 'W', 'D', 'L', '%W', 'pts',
  'tournament', '1', '2', '3', '4+', '%1',
]);


const MainStat = (props) =>
{
  const compileHeader = () =>
  {
    return (
      <React.Fragment>
        <div className={"mainstat__header-empty " +
                        "border-solid-black " +
                        "border-1111 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center "}>
        </div>
        <div className={"mainstat__header-common " +
                        "border-solid-black " +
                        "border-1110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center "}>
        </div>
        <div className={"mainstat__header-matches " +
                        "border-solid-black " +
                        "border-1110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center "}>
          Matches
        </div>
        <div className={"mainstat__header-tournaments " +
                        "border-solid-black " +
                        "border-1110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center "}>
          Tournaments
        </div>

        <div className={"border-solid-black " +
                        "border-0111 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center "}
        >
          N
        </div>
        {/* TODO(pyloolex): Could be refactored.
            smth('name', 'Name'),
            smth('events', '#'),
            . . .
         */}
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               'name')}
        >
          <div>
            Name
            {SortingUtils.getSortingIcon(sorting, 'name')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               'events')}
        >
          <div>
            #
            {SortingUtils.getSortingIcon(sorting, 'events')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               'elo')}
        >
          <div>
            Elo
            {SortingUtils.getSortingIcon(sorting, 'elo')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               'match')}
        >
          <div>
            #
            {SortingUtils.getSortingIcon(sorting, 'match')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               'W')}
        >
          <div>
            W
            {SortingUtils.getSortingIcon(sorting, 'W')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               'D')}
        >
          <div>
            D
            {SortingUtils.getSortingIcon(sorting, 'D')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               'L')}
        >
          <div>
            L
            {SortingUtils.getSortingIcon(sorting, 'L')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               '%W')}
        >
          <div>
            %W
            {SortingUtils.getSortingIcon(sorting, '%W')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               'pts')}
        >
          <div>
            Pts
            {SortingUtils.getSortingIcon(sorting, 'pts')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               'tournament')}
        >
          <div>
            #
            {SortingUtils.getSortingIcon(sorting, 'tournament')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               '1')}
        >
          <div>
            1
            {SortingUtils.getSortingIcon(sorting, '1')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               '2')}
        >
          <div>
            2
            {SortingUtils.getSortingIcon(sorting, '2')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               '3')}
        >
          <div>
            3
            {SortingUtils.getSortingIcon(sorting, '3')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               '4+')}
        >
          <div>
            4+
            {SortingUtils.getSortingIcon(sorting, '4+')}
          </div>
        </div>
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "font-bold " +
                        "grid-content-center " +
                        "sortable-header "}
             onClick={() => SortingUtils.handleHeaderClick(
               sorting, setSorting, props.searchParams, props.setSearchParams,
               '%1')}
        >
          <div>
            %1
            {SortingUtils.getSortingIcon(sorting, '%1')}
          </div>
        </div>
      </React.Fragment>);
  }

  const sortData = () =>
  {
    const data = [];
    for (let player in props.total)
    {
      const element = props.total[player]
      data.push({
        ...element,
        'name': player,
        '%W': Utils.getPercent(element['W'], element['match']),
        'pts': element['W'] * 3 + element['D'],
        '%1': Utils.getPercent(element['1'], element['tournament']),
      });
    }

    SortingUtils.sortData(sorting, data);
    return data;
  }

  const drawElo = (elo, events, rowColor) =>
  {
    if (events < 10)
    {
      return (
        <div className={"border-solid-black " +
                        "border-0110 " +
                        "font-20 " +
                        "grid-content-center "}
             style={{'backgroundColor': rowColor}}>
          {elo + '?'}
        </div>
      );
    }

    return (
      <div className={"border-solid-black " +
                      "border-0110 " +
                      "font-20 " +
                      "grid-content-center "}
           style={{'backgroundColor': Utils.getEloColor(elo)}}>
        {elo}
      </div>
    );
  }

  const compileData = () =>
  {
    const response = [];

    const sorted = sortData();

    for (let i = 0; i < sorted.length; i++)
    {
      const data = sorted[i];
      const rowColor = Utils.getRowColor(i);

      response.push(
        <React.Fragment key={data.name}>
          <div className={"border-solid-black " +
                          "border-0111 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {i + 1}
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-left "}
               style={{'backgroundColor': rowColor}}>
            <p className="margin-left">
              <ReactRouterDom.Link className="player-name-link"
                                   to={`/stats/${data.name}`}>
                {data.name}
              </ReactRouterDom.Link>
            </p>
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {data.events}
          </div>
          {drawElo(data.elo, data.events, rowColor)}
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {data.match}
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {data['W']}
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {data['D']}
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {data['L']}
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {Utils.roundPercent(data['W'], data.match)}
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {data['W'] * 3 + data['D']}
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {data.tournament}
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {data['1']}
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {data['2']}
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {data['3']}
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {data['4+']}
          </div>
          <div className={"border-solid-black " +
                          "border-0110 " +
                          "font-20 " +
                          "grid-content-center "}
               style={{'backgroundColor': rowColor}}>
            {Utils.roundPercent(data['1'], data.tournament)}
          </div>

        </React.Fragment>
      );
    }

    return response;
  }

  const [sorting, setSorting] = React.useState(
    SortingUtils.obtainInitialSorting(
      props.searchParams, DEFAULT_SORTING, POSSIBLE_SORT_VALUES));

  return (
    <div className="mainstat__container">
      {compileHeader()}
      {compileData()}
    </div>
  );
}


const exportDefault = {
  MainStat,
}
export default exportDefault;
