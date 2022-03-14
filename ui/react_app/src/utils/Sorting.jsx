import React from 'react';

import 'index.css';


const SORTING_SEPARATOR = '--';
const ASCENDING_MARK = '<';
const DESCENDING_MARK = '>';
console.assert(ASCENDING_MARK.length === DESCENDING_MARK.length);


const getSortingIcon = (sorting, columnName) =>
{
  if (sorting[0].column === columnName)
  {
    if (sorting[0].order === 1)
    {
      return <img
        className="sorting-icon"
        src="/sort_up.png"
        alt="sort_up"
      />;
    }
    return <img
      className="sorting-icon"
      src="/sort_down.png"
      alt="sort_down"
    />;
  }
  return <img
    className="sorting-icon"
    src="/sortable.png"
    alt="sortable"
    style={{'opacity': 0.2}}
  />;
};


const handleHeaderClick = (
    sorting, setSorting, searchParamsEntries, setSearchParams, columnName) =>
{
  const transformSortingToString = (newSorting) =>
  {
    const transformSortingElemToStr = (element) =>
    {
      return element.column + (
          element.order === 1 ? ASCENDING_MARK : DESCENDING_MARK);
    };

    let sortingString = transformSortingElemToStr(newSorting[0]);
    for (let i = 1; i < newSorting.length; i++)
    {
      sortingString += SORTING_SEPARATOR +
          transformSortingElemToStr(newSorting[i]);
    }
    return sortingString;
  };

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
  if (pos === 0)
  {
    element = {...sorting[pos]};
    element.order *= -1;
  }
  else
  {
    element = {column: columnName, order: -1};
  }

  const newSorting = [element];
  for (let i = 0; i < sorting.length; i++)
  {
    if (i !== pos)
    {
      newSorting.push(sorting[i]);
    }
  }

  setSearchParams({
    ...searchParamsEntries,
    sort: transformSortingToString(newSorting),
  });
  setSorting(newSorting);
};


const obtainInitialSorting = (
    searchParamsEntries, defaultSorting, possibleValues) =>
{
  const parseSorting = (strSorting) =>
  {
    const parseToken = (token, order) =>
    {
      if (possibleValues.has(token.slice(0, -ASCENDING_MARK.length)))
      {
        return {
          column: token.slice(0, -ASCENDING_MARK.length),
          order: order,
        };
      }
      else
      {
        console.error('Unknown sorting parameter:',
            token.slice(0, -ASCENDING_MARK.length));
        return null;
      }
    };

    const response = [];

    const tokens = strSorting.split(SORTING_SEPARATOR);
    for (let i = 0; i < tokens.length; i++)
    {
      let parsedToken = null;
      if (tokens[i].endsWith(ASCENDING_MARK))
      {
        parsedToken = parseToken(tokens[i], 1);
      }
      else if (tokens[i].endsWith(DESCENDING_MARK))
      {
        parsedToken = parseToken(tokens[i], -1);
      }
      else
      {
        console.error(
            `Sorting parameter should end with "${ASCENDING_MARK}" ` +
            `or "${DESCENDING_MARK}":`, tokens[i]);
      }

      if (parsedToken === null)
      {
        return null;
      }

      response.push(parsedToken);
    }

    return response;
  };

  if (!searchParamsEntries.hasOwnProperty('sort'))
  {
    return defaultSorting;
  }

  const parsedSorting = parseSorting(searchParamsEntries.sort);
  if (parsedSorting === null)
  {
    return defaultSorting;
  }

  return parsedSorting;
};


const sortData = (sorting, data) =>
{
  const compare = (a, b) =>
  {
    if (a.constructor === Array)
    {
      console.assert(b.constructor === Array && a.length === b.length);

      for (let i = 0; i < a.length; i++)
      {
        const compared = compare(a[i], b[i]);
        if (compared !== 0)
        {
          return compared;
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
  };

  data.sort((a, b) =>
  {
    for (const param of sorting)
    {
      const compared = compare(a[param.column], b[param.column]);
      if (compared !== 0)
      {
        return param.order * compared;
      }
    }
    return 0;
  });
};


const exportDefault = {
  getSortingIcon,
  handleHeaderClick,
  obtainInitialSorting,
  sortData,
};
export default exportDefault;
