import React from 'react';
import * as ReactRouterDom from 'react-router-dom';

import SortingUtils from 'utils/Sorting';


const makeSortableHeader = (
    displayName, keyName,
    sorting, setSorting, searchParamsEntries, setSearchParams) =>
{
  return <div
    className={'border-solid-black ' +
               'border-1110 ' +
               'font-20 ' +
               'font-bold ' +
               'grid-content-center ' +
               'sortable-header '}
    onClick={() => SortingUtils.handleHeaderClick(
        sorting, setSorting, searchParamsEntries,
        setSearchParams, keyName)}
  >
    <div>
      {displayName}
      {SortingUtils.getSortingIcon(sorting, keyName)}
    </div>
  </div>;
};

const makeStandardDataCell = (data, rowColor, border='0110') =>
{
  return <div
    className={'border-solid-black ' +
               'border-' + border + ' ' +
               'font-20 ' +
               'grid-content-center '}
    style={{'backgroundColor': rowColor}}
  >
    {data}
  </div>;
};

const makeIndexNumberCell = (idx, rowColor) =>
{
  return <div
    className={'border-solid-black ' +
               'border-0111 ' +
               'font-20 ' +
               'grid-content-center '}
    style={{'backgroundColor': rowColor}}
  >
    {idx}
  </div>;
};

const makePlayerNameCell = (playerName, rowColor) =>
{
  return <div
    className={'border-solid-black ' +
               'border-0110 ' +
               'font-20 ' +
               'grid-content-left '}
    style={{'backgroundColor': rowColor}}
  >
    <p className='margin-left'>
      <ReactRouterDom.Link
        className='player-name-link'
        to={`/stats/${playerName}`}
      >
        {playerName}
      </ReactRouterDom.Link>
    </p>
  </div>;
};

const exportDefault =
{
  makeIndexNumberCell,
  makePlayerNameCell,
  makeSortableHeader,
  makeStandardDataCell,
};
export default exportDefault;
