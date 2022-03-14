import PropTypes from 'prop-types';
import React from 'react';
import * as ReactRouterDom from 'react-router-dom';

import PropTypesUtils from 'utils/PropTypes';
import SortingUtils from 'utils/Sorting';
import TableUtils from 'utils/Table';
import Utils from 'utils/utils';

import 'index.css';
import 'components/main_stat.css';


const DEFAULT_SORTING = [{column: 'elo', order: -1}];
const POSSIBLE_SORT_VALUES = new Set([
  'name',
  'events', 'elo',
  'match', 'W', 'D', 'L', 'perc_W', 'pts',
  'tournament', '1', '2', '3', '4', 'perc_1',
]);


const MainStat = (props) =>
{
  const compileHeader = () =>
  {
    return (
      <React.Fragment>
        <div className={'mainstat__header-empty ' +
                        'border-solid-black ' +
                        'border-1101 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
        </div>
        <div className={'mainstat__header-common ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
        </div>
        <div className={'mainstat__header-matches ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          Matches
        </div>
        <div className={'mainstat__header-tournaments ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          Tournaments
        </div>

        <div className={'border-solid-black ' +
                        'border-1111 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}
        >
          N
        </div>
        {TableUtils.makeSortableHeader(
            'Name', 'name',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '#', 'events',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Elo', 'elo',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '#', 'match',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'W', 'W',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'D', 'D',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'L', 'L',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '%W', 'perc_W',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Pts', 'pts',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '#', 'tournament',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '1', '1',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '2', '2',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '3', '3',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '4+', '4',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '%1', 'perc_1',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
      </React.Fragment>);
  };

  const sortData = () =>
  {
    const data = [];
    Object.keys(props.total).forEach((player) =>
    {
      const element = props.total[player];
      data.push({
        ...element,
        'name': player,
        'perc_W': Utils.getPercent(element['W'], element['match']),
        'pts': element['W'] * 3 + element['D'],
        // It's needed in order to make query string prettier, namely
        // in order to avoid "%2B" in a query string.
        '4': element['4+'],
        'perc_1': Utils.getPercent(element['1'], element['tournament']),
      });
    });

    SortingUtils.sortData(sorting, data);
    return data;
  };

  const drawElo = (elo, events, rowColor) =>
  {
    if (events < 10)
    {
      return (
        <div
          className={'border-solid-black ' +
                     'border-0110 ' +
                     'font-20 ' +
                     'grid-content-center '}
          style={{'backgroundColor': rowColor}}
        >
          {elo + '?'}
        </div>
      );
    }

    return (
      <div
        className={'border-solid-black ' +
                   'border-0110 ' +
                   'font-20 ' +
                   'grid-content-center '}
        style={{'backgroundColor': Utils.getEloColor(elo)}}
      >
        {elo}
      </div>
    );
  };

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
            <div
              className={'border-solid-black ' +
                         'border-0111 ' +
                         'font-20 ' +
                         'grid-content-center '}
              style={{'backgroundColor': rowColor}}
            >
              {i + 1}
            </div>
            <div
              className={'border-solid-black ' +
                         'border-0110 ' +
                         'font-20 ' +
                         'grid-content-left '}
              style={{'backgroundColor': rowColor}}
            >
              <p className='margin-left'>
                <ReactRouterDom.Link
                  className='player-name-link'
                  to={`/stats/${data.name}`}
                >
                  {data.name}
                </ReactRouterDom.Link>
              </p>
            </div>
            {TableUtils.makeStandardDataCell(data.events, rowColor)}
            {drawElo(data.elo, data.events, rowColor)}
            {TableUtils.makeStandardDataCell(data.match, rowColor)}
            {TableUtils.makeStandardDataCell(data['W'], rowColor)}
            {TableUtils.makeStandardDataCell(data['D'], rowColor)}
            {TableUtils.makeStandardDataCell(data['L'], rowColor)}
            {TableUtils.makeStandardDataCell(
                Utils.drawPercent(data['perc_W']), rowColor)}
            {TableUtils.makeStandardDataCell(data['pts'], rowColor)}
            {TableUtils.makeStandardDataCell(data.tournament, rowColor)}
            {TableUtils.makeStandardDataCell(data['1'], rowColor)}
            {TableUtils.makeStandardDataCell(data['2'], rowColor)}
            {TableUtils.makeStandardDataCell(data['3'], rowColor)}
            {TableUtils.makeStandardDataCell(data['4'], rowColor)}
            {TableUtils.makeStandardDataCell(
                Utils.drawPercent(data['perc_1']), rowColor)}
          </React.Fragment>,
      );
    }

    return response;
  };

  const [sorting, setSorting] = React.useState(
      SortingUtils.obtainInitialSorting(
          props.searchParamsEntries, DEFAULT_SORTING, POSSIBLE_SORT_VALUES));

  return (
    <div className='mainstat__container'>
      {compileHeader()}
      {compileData()}
    </div>
  );
};


MainStat.propTypes = {
  total: PropTypes.objectOf(PropTypesUtils.MAIN_STAT_SCHEMA).isRequired,
  searchParamsEntries: PropTypesUtils.SEARCH_PARAMS_SCHEMA.isRequired,
  setSearchParams: PropTypes.func.isRequired,
};


const exportDefault = {
  MainStat,
};
export default exportDefault;
