import React, {useState} from 'react';
import PropTypes from 'prop-types';

import PropTypesUtils from 'utils/PropTypes';
import SortingUtils from 'utils/Sorting';
import TableUtils from 'utils/Table';
import Utils from 'utils/utils';

import 'index.css';
import 'components/cross_player_interactions.css';


const DEFAULT_SORTING = [{column: 'match_result', order: -1}];
const POSSIBLE_SORT_VALUES = new Set([
  'name', 'events', 'match', 'match_result',
  'perc_W', 'perc_D', 'perc_L',
  'tournament', 'tournament_result',
  'perc_1', 'perc_2', 'perc_3', 'perc_4',
]);


const CrossPlayerInteractions = (props) =>
{
  const MIN_PERC_TO_DRAW = 12;

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
        style={{'flex': `${value} ${value}`}}>
        {content}
      </div>
    );
  };

  const drawMatchChart = (data) =>
  {
    if (data.W + data.D + data.L === 0)
    {
      return null;
    }

    return (
      <React.Fragment>
        {drawSection(data.W, data.match, 'cpi__w-section')}
        {drawSection(data.D, data.match, 'cpi__d-section')}
        {drawSection(data.L, data.match, 'cpi__l-section')}
      </React.Fragment>
    );
  };

  const drawTournamentChart = (data) =>
  {
    if (data['1'] + data['2'] + data['3'] + data['4+'] === 0)
    {
      return null;
    }

    return (
      <React.Fragment>
        {drawSection(data['1'], data.tournament, 'cpi__1-section')}
        {drawSection(data['2'], data.tournament, 'cpi__2-section')}
        {drawSection(data['3'], data.tournament, 'cpi__3-section')}
        {drawSection(data['4+'], data.tournament, 'cpi__4-section')}
      </React.Fragment>
    );
  };

  const sortData = () =>
  {
    const data = [];
    Object.keys(props.playerData).forEach((player) =>
    {
      const element = props.playerData[player];
      data.push({
        ...element,
        'name': player,

        'match_result': [
          Utils.getPercent(element['W'], element['match']),
          Utils.getPercent(element['D'], element['match']),
          Utils.getPercent(element['L'], element['match']),
        ],
        'tournament_result': [
          Utils.getPercent(element['1'], element['tournament']),
          Utils.getPercent(element['2'], element['tournament']),
          Utils.getPercent(element['3'], element['tournament']),
          Utils.getPercent(element['4+'], element['tournament']),
        ],

        'perc_W': Utils.getPercent(element['W'], props.resultSummary['W']),
        'perc_D': Utils.getPercent(element['D'], props.resultSummary['D']),
        'perc_L': Utils.getPercent(element['L'], props.resultSummary['L']),
        'perc_1': Utils.getPercent(element['1'], props.resultSummary['1']),
        'perc_2': Utils.getPercent(element['2'], props.resultSummary['2']),
        'perc_3': Utils.getPercent(element['3'], props.resultSummary['3']),
        'perc_4': Utils.getPercent(element['4+'], props.resultSummary['4+']),
      });
    });

    SortingUtils.sortData(sorting, data);
    return data;
  };

  const compileHeader = () =>
  {
    return (
      <React.Fragment>
        {/* First level */}
        <div className={'cpi__header-empty ' +
                        'border-solid-black ' +
                        'border-1101 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
        </div>
        <div className={'cpi__header-common ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
        </div>
        <div className={'cpi__header-matches ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          Matches
        </div>
        <div className={'cpi__header-tournaments ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          Tournaments
        </div>

        {/* Second level */}
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
            '#', 'match',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Result', 'match_result',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'W', 'perc_W',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'D', 'perc_D',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'L', 'perc_L',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '#', 'tournament',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Result', 'tournament_result',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '1', 'perc_1',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '2', 'perc_2',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '3', 'perc_3',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            '4+', 'perc_4',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
      </React.Fragment>
    );
  };

  const compileData = () =>
  {
    const response = [];

    const sortedData = sortData();

    for (let i = 0; i < sortedData.length; i++)
    {
      const data = sortedData[i];
      const rowColor = Utils.getRowColor(i);

      response.push(
          <React.Fragment key={data.name}>
            {TableUtils.makeIndexNumberCell(i + 1, rowColor)}
            {TableUtils.makePlayerNameCell(data.name, rowColor)}
            {TableUtils.makeStandardDataCell(data.events, rowColor, '0210')}
            {TableUtils.makeStandardDataCell(data.match, rowColor, '0111')}
            <div
              className={'border-solid-black ' +
                         'border-0110 ' +
                         'font-20 ' +
                         'grid-content-center ' +
                         'cpi__match-chart '}
              style={{'backgroundColor': rowColor}}
            >
              {drawMatchChart(data)}
            </div>
            {TableUtils.makeStandardDataCell(
                Utils.drawPercent(data['perc_W']), rowColor)}
            {TableUtils.makeStandardDataCell(
                Utils.drawPercent(data['perc_D']), rowColor)}
            {TableUtils.makeStandardDataCell(
                Utils.drawPercent(data['perc_L']), rowColor, '0210')}
            {TableUtils.makeStandardDataCell(
                data.tournament, rowColor, '0111')}
            <div
              className={'border-solid-black ' +
                         'border-0110 ' +
                         'font-20 ' +
                         'grid-content-center ' +
                         'cpi__tournament-chart '}
              style={{'backgroundColor': rowColor}}
            >
              {drawTournamentChart(data)}
            </div>
            {TableUtils.makeStandardDataCell(
                Utils.drawPercent(data['perc_1']), rowColor)}
            {TableUtils.makeStandardDataCell(
                Utils.drawPercent(data['perc_2']), rowColor)}
            {TableUtils.makeStandardDataCell(
                Utils.drawPercent(data['perc_3']), rowColor)}
            {TableUtils.makeStandardDataCell(
                Utils.drawPercent(data['perc_4']), rowColor)}
          </React.Fragment>,
      );
    }

    return response;
  };

  const [sorting, setSorting] = useState(SortingUtils.obtainInitialSorting(
      props.searchParamsEntries, DEFAULT_SORTING, POSSIBLE_SORT_VALUES));

  return (
    <div className="cpi__container">
      {compileHeader()}
      {compileData()}
    </div>
  );
};


CrossPlayerInteractions.propTypes =
{
  playerData: PropTypes.objectOf(PropTypes.exact(
      PropTypesUtils.RESULT_SUMMARY_FIELDS_REQUIRED)),
  resultSummary: PropTypes.exact(
      PropTypesUtils.RESULT_SUMMARY_FIELDS_OPTIONAL),
  searchParamsEntries: PropTypesUtils.SEARCH_PARAMS_SCHEMA.isRequired,
  setSearchParams: PropTypes.func.isRequired,
};


const exportDefault =
{
  CrossPlayerInteractions,
};
export default exportDefault;
