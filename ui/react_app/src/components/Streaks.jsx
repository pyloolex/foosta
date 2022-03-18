import PropTypes from 'prop-types';
import React from 'react';

import PropTypesUtils from 'utils/PropTypes';
import SortingUtils from 'utils/Sorting';
import TableUtils from 'utils/Table';
import Utils from 'utils/utils';

import 'index.css';
import 'components/streaks.css';


const DEFAULT_SORTING = [{column: 'e_l', order: -1}];
const POSSIBLE_SORT_VALUES = new Set([
  'name',
  'e_c', 'e_l',
  'w_c', 'w_l', 'nw_c', 'nw_l',
  'g_c', 'g_l', 'ng_c', 'ng_l',
]);


const Streaks = (props) =>
{
  const compileHeader = () =>
  {
    return (
      <React.Fragment>
        {/* First level */}
        <div className={'streaks__header-empty1 ' +
                        'border-solid-black ' +
                        'border-1101 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
        </div>
        <div className={'streaks__header-empty2 ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
        </div>
        <div className={'streaks__header-matches ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          Matches
        </div>
        <div className={'streaks__header-tournaments ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          Tournaments
        </div>

        {/* Second level */}
        <div className={'streaks__header-empty3 ' +
                        'border-solid-black ' +
                        'border-0101 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
        </div>
        <div className={'streaks__header-events ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          Events
        </div>
        <div className={'streaks__header-wins ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          Wins
        </div>
        <div className={'streaks__header-no-wins ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          No wins
        </div>
        <div className={'streaks__header-gold ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          Gold
        </div>
        <div className={'streaks__header-no-gold ' +
                        'border-solid-black ' +
                        'border-1100 ' +
                        'font-20 ' +
                        'font-bold ' +
                        'grid-content-center '}>
          No gold
        </div>

        {/* Third level */}
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
            'Current', 'e_c',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Longest', 'e_l',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Current', 'w_c',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Longest', 'w_l',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Current', 'nw_c',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Longest', 'nw_l',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Current', 'g_c',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Longest', 'g_l',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Current', 'ng_c',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
        {TableUtils.makeSortableHeader(
            'Longest', 'ng_l',
            sorting, setSorting,
            props.searchParamsEntries, props.setSearchParams)}
      </React.Fragment>);
  };

  const sortData = () =>
  {
    const data = [];
    Object.keys(props.streaks).forEach((player) =>
    {
      const element = props.streaks[player];
      data.push({
        ...element,
        'name': player,
        'e_c': element['events']['current'],
        'e_l': element['events']['longest'],
        'w_c': element['wins']['current'],
        'w_l': element['wins']['longest'],
        'nw_c': element['no_wins']['current'],
        'nw_l': element['no_wins']['longest'],
        'g_c': element['gold']['current'],
        'g_l': element['gold']['longest'],
        'ng_c': element['no_gold']['current'],
        'ng_l': element['no_gold']['longest'],
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
            {TableUtils.makeStandardDataCell(data['e_c'], rowColor)}
            {TableUtils.makeStandardDataCell(data['e_l'], rowColor)}
            {TableUtils.makeStandardDataCell(data['w_c'], rowColor)}
            {TableUtils.makeStandardDataCell(data['w_l'], rowColor)}
            {TableUtils.makeStandardDataCell(data['nw_c'], rowColor)}
            {TableUtils.makeStandardDataCell(data['nw_l'], rowColor)}
            {TableUtils.makeStandardDataCell(data['g_c'], rowColor)}
            {TableUtils.makeStandardDataCell(data['g_l'], rowColor)}
            {TableUtils.makeStandardDataCell(data['ng_c'], rowColor)}
            {TableUtils.makeStandardDataCell(data['ng_l'], rowColor)}
          </React.Fragment>,
      );
    }

    return response;
  };

  const [sorting, setSorting] = React.useState(
      SortingUtils.obtainInitialSorting(
          props.searchParamsEntries, DEFAULT_SORTING, POSSIBLE_SORT_VALUES));

  return (
    <div className='streaks__container'>
      {compileHeader()}
      {compileData()}
    </div>
  );
};


Streaks.propTypes = {
  streaks: PropTypes.objectOf(PropTypes.exact({
    'events': PropTypesUtils.STREAK_PARAMS.isRequired,
    'wins': PropTypesUtils.STREAK_PARAMS.isRequired,
    'no_wins': PropTypesUtils.STREAK_PARAMS.isRequired,
    'gold': PropTypesUtils.STREAK_PARAMS.isRequired,
    'no_gold': PropTypesUtils.STREAK_PARAMS.isRequired,
  })).isRequired,
  searchParamsEntries: PropTypesUtils.SEARCH_PARAMS_SCHEMA.isRequired,
  setSearchParams: PropTypes.func.isRequired,
};


const exportDefault = {
  Streaks,
};
export default exportDefault;
