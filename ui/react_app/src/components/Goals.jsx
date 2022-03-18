import PropTypes from 'prop-types';
import React from 'react';

import PropTypesUtils from 'utils/PropTypes';
import SortingUtils from 'utils/Sorting';
import TableUtils from 'utils/Table';
import Utils from 'utils/utils';

import 'index.css';
import 'components/goals.css';


const DEFAULT_SORTING = [{column: 't_d', order: -1}];
const POSSIBLE_SORT_VALUES = new Set([
  'name', 'match',
  't_s', 't_c', 't_d',
  'a_s', 'a_c', 'a_d',
]);


const Goals = (props) =>
{
  const compileHeader = () =>
  {
    return (
      <React.Fragment>
        {/* First level */}
        <div className={'goals__header-empty1 ' +
                        'border-solid-black ' +
                        'border-1101 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
        </div>
        <div className={'goals__header-empty2 ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
        </div>
        <div className={'goals__header-total ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          Total
        </div>
        <div className={'goals__header-average ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          Average
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
            '#', 'match',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Scored', 't_s',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Conc', 't_c',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Diff', 't_d',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Scored', 'a_s',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Conc', 'a_c',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Diff', 'a_d',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
      </React.Fragment>);
  };

  const sortData = () =>
  {
    const data = [];
    Object.keys(props.goals).forEach((player) =>
    {
      const element = props.goals[player];
      data.push({
        ...element,
        'name': player,
        't_s': element['scored'],
        't_c': element['conceded'],
        't_d': element['scored'] - element['conceded'],
        'a_s': (element['scored'] / element['match']).toFixed(1),
        'a_c': (element['conceded'] / element['match']).toFixed(1),
        'a_d': ((element['scored'] - element['conceded']) /
                element['match']).toFixed(1),
      });
    });

    SortingUtils.sortData(sorting, data);
    return data;
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
            {TableUtils.makeIndexNumberCell(i + 1, rowColor)}
            {TableUtils.makePlayerNameCell(data.name, rowColor)}
            {TableUtils.makeStandardDataCell(data['match'], rowColor, '0210')}
            {TableUtils.makeStandardDataCell(data['t_s'], rowColor, '0111')}
            {TableUtils.makeStandardDataCell(data['t_c'], rowColor)}
            {TableUtils.makeStandardDataCell(data['t_d'], rowColor, '0210')}
            {TableUtils.makeStandardDataCell(data['a_s'], rowColor, '0111')}
            {TableUtils.makeStandardDataCell(data['a_c'], rowColor)}
            {TableUtils.makeStandardDataCell(data['a_d'], rowColor)}
          </React.Fragment>,
      );
    }

    return response;
  };

  const [sorting, setSorting] = React.useState(
      SortingUtils.obtainInitialSorting(
          props.searchParamsEntries, DEFAULT_SORTING, POSSIBLE_SORT_VALUES));

  return (
    <div className='goals__container'>
      {compileHeader()}
      {compileData()}
    </div>
  );
};


Goals.propTypes = {
  goals: PropTypes.objectOf(PropTypes.exact({
    'match': PropTypes.number.isRequired,
    'scored': PropTypes.number.isRequired,
    'conceded': PropTypes.number.isRequired,
  })).isRequired,
  searchParamsEntries: PropTypesUtils.SEARCH_PARAMS_SCHEMA.isRequired,
  setSearchParams: PropTypes.func.isRequired,
};


const exportDefault = {
  Goals,
};
export default exportDefault;
