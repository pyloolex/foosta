const obtainInitialChosen = (
    searchParamsEntries, defaultChosen,
    possibleValues) =>
{
  if (!searchParamsEntries.hasOwnProperty('stat'))
  {
    return defaultChosen;
  }

  if (!possibleValues.has(searchParamsEntries.stat))
  {
    console.error('Invalid stat in URL params:', searchParamsEntries.stat);
    return defaultChosen;
  }

  return searchParamsEntries.stat;
};


const handleChosenChange = (setChosen, setSearchParams, newValue) =>
{
  // Removing all the params except for `stat` because when the `stat`
  // changes, old `sort` params don't make sense anymore.
  setSearchParams({
    stat: newValue,
  });
  setChosen(newValue);
};


const getPercent = (value, total) =>
{
  if (value === 0) return 0;
  return value * 100 / total;
};


const roundPercent = (value, total) =>
{
  const perc = getPercent(value, total);
  if (perc > 0)
  {
    return perc.toFixed(1);
  }
  return 0;
};


const getRowColor = (idx) =>
{
  // Foosta's base background color or a bit brighter.
  return idx % 2 ? '#F0FFFB' : '#E3F5FF';
};


const getEloColor = (rating) =>
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
};


const exportDefault = {
  getEloColor,
  getPercent,
  getRowColor,
  handleChosenChange,
  obtainInitialChosen,
  roundPercent,
};
export default exportDefault;
