import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Link, useSearchParams} from 'react-router-dom';

import PropTypesUtils from 'utils/PropTypes';
import SortingUtils from 'utils/Sorting';
import Utils from 'utils/utils';

import 'index.css';
import 'components/teammates.css';


const DEFAULT_SORTING = [{column: 'match_result', order: -1}];
const POSSIBLE_SORT_VALUES = new Set([
  'name', 'events', 'match', 'match_result',
  'perc_W', 'perc_D', 'perc_L',
  'tournament', 'tournament_result',
  'perc_1', 'perc_2', 'perc_3', 'perc_4',
]);


const Teammates = ({teammates, resultSummary}) =>
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
        {drawSection(data.W, data.match, 'teammates__w-section')}
        {drawSection(data.D, data.match, 'teammates__d-section')}
        {drawSection(data.L, data.match, 'teammates__l-section')}
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
        {drawSection(data['1'], data.tournament, 'teammates__1-section')}
        {drawSection(data['2'], data.tournament, 'teammates__2-section')}
        {drawSection(data['3'], data.tournament, 'teammates__3-section')}
        {drawSection(data['4+'], data.tournament, 'teammates__4-section')}
      </React.Fragment>
    );
  };

  const sortTeammates = () =>
  {
    const data = [];
    Object.keys(teammates).forEach((player) =>
    {
      const element = teammates[player];
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

        'perc_W': Utils.getPercent(element['W'], resultSummary['W']),
        'perc_D': Utils.getPercent(element['D'], resultSummary['D']),
        'perc_L': Utils.getPercent(element['L'], resultSummary['L']),
        'perc_1': Utils.getPercent(element['1'], resultSummary['1']),
        'perc_2': Utils.getPercent(element['2'], resultSummary['2']),
        'perc_3': Utils.getPercent(element['3'], resultSummary['3']),
        'perc_4': Utils.getPercent(element['4+'], resultSummary['4+']),
      });
    });

    SortingUtils.sortData(sorting, data);
    return data;
  };

  const compileData = () =>
  {
    const response = [];

    const sortedTeammates = sortTeammates();

    for (let i = 0; i < sortedTeammates.length; i++)
    {
      const data = sortedTeammates[i];
      const rowColor = Utils.getRowColor(i);

      response.push(
          <React.Fragment key={data.name}>
            <div className={'teammates__border-base ' +
                          'teammates__border-u ' +
                          'teammates__cell-data'}
            style={{'backgroundColor': rowColor}}>
              {i + 1}</div>
            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-name'}
            style={{'backgroundColor': rowColor}}>
              <p className="teammates__player-name">
                <Link className="player-name-link"
                  to={`/stats/${data.name}`}>
                  {data.name}
                </Link>
              </p>
            </div>
            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-data'}
            style={{'backgroundColor': rowColor}}>
              {data.events}</div>
            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-data'}
            style={{'backgroundColor': rowColor}}>
              {data.match}</div>

            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-data ' +
                          'teammates__match-chart'}
            style={{'backgroundColor': rowColor}}>
              {drawMatchChart(data)}
            </div>

            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-data'}
            style={{'backgroundColor': rowColor}}>
              {Utils.drawPercent(data['perc_W'])}
            </div>
            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-data'}
            style={{'backgroundColor': rowColor}}>
              {Utils.drawPercent(data['perc_D'])}
            </div>
            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-data'}
            style={{'backgroundColor': rowColor}}>
              {Utils.drawPercent(data['perc_L'])}
            </div>
            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-data'}
            style={{'backgroundColor': rowColor}}>{data.tournament}</div>
            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-data ' +
                          'teammates__tournament-chart'}
            style={{'backgroundColor': rowColor}}>
              {drawTournamentChart(data)}
            </div>
            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-data'}
            style={{'backgroundColor': rowColor}}>
              {Utils.drawPercent(data['perc_1'])}
            </div>
            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-data'}
            style={{'backgroundColor': rowColor}}>
              {Utils.drawPercent(data['perc_2'])}
            </div>
            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-data'}
            style={{'backgroundColor': rowColor}}>
              {Utils.drawPercent(data['perc_3'])}
            </div>
            <div className={'teammates__border-base ' +
                          'teammates__border-corner ' +
                          'teammates__cell-data'}
            style={{'backgroundColor': rowColor}}>
              {Utils.drawPercent(data['perc_4'])}
            </div>
          </React.Fragment>,
      );
    }

    return response;
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsEntries = Object.fromEntries(searchParams.entries());

  const [sorting, setSorting] = useState(SortingUtils.obtainInitialSorting(
      searchParamsEntries, DEFAULT_SORTING, POSSIBLE_SORT_VALUES));

  return (
    <div className="teammates__container">
      <div className={'teammates__empty-header ' +
                      'teammates__border-base ' +
                      'teammates__border-full ' +
                      'teammates__header'}></div>
      <div className={'teammates__common-header ' +
                      'teammates__border-base ' +
                      'teammates__border-moon ' +
                      'teammates__header'}></div>
      <div className={'teammates__matches-header ' +
                      'teammates__border-base ' +
                      'teammates__border-moon ' +
                      'teammates__header'}>
      Matches</div>
      <div className={'teammates__tournaments-header ' +
                      'teammates__border-base ' +
                      'teammates__border-moon ' +
                      'teammates__header'}>
      Tournaments</div>

      <div className={'teammates__n-header ' +
                      'teammates__border-base ' +
                      'teammates__border-u ' +
                      'teammates__header'}>N</div>
      <div className={'teammates__name-header ' +
                      'teammates__border-base ' +
                      'teammates__border-corner ' +
                      'teammates__header ' +
                      'sortable-header'}
      onClick={() => SortingUtils.handleHeaderClick(
          sorting, setSorting, searchParamsEntries, setSearchParams,
          'name')}>
        <div>
          Name
          {SortingUtils.getSortingIcon(sorting, 'name')}
        </div>
      </div>
      <div
        className={'teammates__events-header ' +
                   'teammates__border-base ' +
                   'teammates__border-corner ' +
                   'teammates__header ' +
                   'sortable-header'}
        onClick={() => SortingUtils.handleHeaderClick(
            sorting, setSorting, searchParamsEntries, setSearchParams,
            'events')}
      >
        <div>
          #
          {SortingUtils.getSortingIcon(sorting, 'events')}
        </div>
      </div>
      <div className={'teammates__match-header ' +
                      'teammates__border-base ' +
                      'teammates__border-corner ' +
                      'teammates__header ' +
                      'sortable-header'}
      onClick={() => SortingUtils.handleHeaderClick(
          sorting, setSorting, searchParamsEntries, setSearchParams,
          'match')}>
        <div>
          #
          {SortingUtils.getSortingIcon(sorting, 'match')}
        </div>
      </div>
      <div className={'teammates__mchart-header ' +
                      'teammates__border-base ' +
                      'teammates__border-corner ' +
                      'teammates__header ' +
                      'sortable-header'}
      onClick={() => SortingUtils.handleHeaderClick(
          sorting, setSorting, searchParamsEntries, setSearchParams,
          'match_result')}>
        <div>
          Result
          {SortingUtils.getSortingIcon(sorting, 'match_result')}
        </div>
      </div>
      <div className={'teammates__w-header ' +
                      'teammates__border-base ' +
                      'teammates__border-corner ' +
                      'teammates__header ' +
                      'sortable-header'}
      onClick={() => SortingUtils.handleHeaderClick(
          sorting, setSorting, searchParamsEntries, setSearchParams,
          'perc_W')}>
        <div>
          W
          {SortingUtils.getSortingIcon(sorting, 'perc_W')}
        </div>
      </div>
      <div className={'teammates__d-header ' +
                      'teammates__border-base ' +
                      'teammates__border-corner ' +
                      'teammates__header ' +
                      'sortable-header'}
      onClick={() => SortingUtils.handleHeaderClick(
          sorting, setSorting, searchParamsEntries, setSearchParams,
          'perc_D')}>
        <div>
          D
          {SortingUtils.getSortingIcon(sorting, 'perc_D')}
        </div>
      </div>
      <div className={'teammates__l-header ' +
                      'teammates__border-base ' +
                      'teammates__border-corner ' +
                      'teammates__header ' +
                      'sortable-header'}
      onClick={() => SortingUtils.handleHeaderClick(
          sorting, setSorting, searchParamsEntries, setSearchParams,
          'perc_L')}>
        <div>
          L
          {SortingUtils.getSortingIcon(sorting, 'perc_L')}
        </div>
      </div>
      <div className={'teammates__tournament-header ' +
                      'teammates__border-base ' +
                      'teammates__border-corner ' +
                      'teammates__header ' +
                      'sortable-header'}
      onClick={() => SortingUtils.handleHeaderClick(
          sorting, setSorting, searchParamsEntries, setSearchParams,
          'tournament')}>
        <div>
          #
          {SortingUtils.getSortingIcon(sorting, 'tournament')}
        </div>
      </div>
      <div className={'teammates__tchart-header ' +
                      'teammates__border-base ' +
                      'teammates__border-corner ' +
                      'teammates__header ' +
                      'sortable-header'}
      onClick={() => SortingUtils.handleHeaderClick(
          sorting, setSorting, searchParamsEntries, setSearchParams,
          'tournament_result')}>
        <div>
          Result
          {SortingUtils.getSortingIcon(sorting, 'tournament_result')}
        </div>
      </div>
      <div className={'teammates__g-header ' +
                      'teammates__border-base ' +
                      'teammates__border-corner ' +
                      'teammates__header ' +
                      'sortable-header'}
      onClick={() => SortingUtils.handleHeaderClick(
          sorting, setSorting, searchParamsEntries, setSearchParams,
          'perc_1')}>
        <div>
          1
          {SortingUtils.getSortingIcon(sorting, 'perc_1')}
        </div>
      </div>
      <div className={'teammates__s-header ' +
                      'teammates__border-base ' +
                      'teammates__border-corner ' +
                      'teammates__header ' +
                      'sortable-header'}
      onClick={() => SortingUtils.handleHeaderClick(
          sorting, setSorting, searchParamsEntries, setSearchParams,
          'perc_2')}>
        <div>
          2
          {SortingUtils.getSortingIcon(sorting, 'perc_2')}
        </div>
      </div>
      <div
        className={'teammates__b-header ' +
                   'teammates__border-base ' +
                   'teammates__border-corner ' +
                   'teammates__header ' +
                   'sortable-header'}
        onClick={() => SortingUtils.handleHeaderClick(
            sorting, setSorting, searchParamsEntries, setSearchParams,
            'perc_3')}>
        <div>
          3
          {SortingUtils.getSortingIcon(sorting, 'perc_3')}
        </div>
      </div>
      <div className={'teammates__e-header ' +
                      'teammates__border-base ' +
                      'teammates__border-corner ' +
                      'teammates__header ' +
                      'sortable-header'}
      onClick={() => SortingUtils.handleHeaderClick(
          sorting, setSorting, searchParamsEntries, setSearchParams,
          'perc_4')}>
        <div>
          4+
          {SortingUtils.getSortingIcon(sorting, 'perc_4')}
        </div>
      </div>

      {compileData()}
    </div>
  );
};


Teammates.propTypes =
{
  teammates: PropTypes.objectOf(PropTypes.exact(
      PropTypesUtils.RESULT_SUMMARY_FIELDS_REQUIRED)),
  resultSummary: PropTypes.exact(
      PropTypesUtils.RESULT_SUMMARY_FIELDS_OPTIONAL),
};


const exportDefault =
{
  Teammates,
};
export default exportDefault;
