import PropTypes from 'prop-types';


const RESULT_SUMMARY_FIELDS_OPTIONAL =
{
  'events': PropTypes.number,
  'match': PropTypes.number,
  'tournament': PropTypes.number,
  'W': PropTypes.number,
  'D': PropTypes.number,
  'L': PropTypes.number,
  '1': PropTypes.number,
  '2': PropTypes.number,
  '3': PropTypes.number,
  '4+': PropTypes.number,
};
const RESULT_SUMMARY_FIELDS_REQUIRED =
{
  'events': PropTypes.number.isRequired,
  'match': PropTypes.number.isRequired,
  'tournament': PropTypes.number.isRequired,
  'W': PropTypes.number.isRequired,
  'D': PropTypes.number.isRequired,
  'L': PropTypes.number.isRequired,
  '1': PropTypes.number.isRequired,
  '2': PropTypes.number.isRequired,
  '3': PropTypes.number.isRequired,
  '4+': PropTypes.number.isRequired,
};
console.assert(
    JSON.stringify(Object.keys(RESULT_SUMMARY_FIELDS_OPTIONAL).sort()) ===
    JSON.stringify(Object.keys(RESULT_SUMMARY_FIELDS_REQUIRED).sort()),
    Object.keys(RESULT_SUMMARY_FIELDS_OPTIONAL),
    Object.keys(RESULT_SUMMARY_FIELDS_REQUIRED),
);


const MAIN_STAT_SCHEMA = PropTypes.exact(Object.assign(
    {
      elo: PropTypes.number.isRequired,
    },
    RESULT_SUMMARY_FIELDS_REQUIRED,
));

const SEARCH_PARAMS_SCHEMA = PropTypes.exact(
    {
      sort: PropTypes.string,
      stat: PropTypes.string,
    },
);

const EVENT_SCHEMA = PropTypes.exact(
    {
      date: PropTypes.string.isRequired,
      event_number: PropTypes.number.isRequired,
      event_type: PropTypes.string.isRequired,
      teams: PropTypes.arrayOf(PropTypes.exact(
          {
            result: PropTypes.number.isRequired,
            squad: PropTypes.arrayOf(PropTypes.string).isRequired,
          },
      )).isRequired,
    },
);

const cachedPlayersValidator = (props, propName) =>
{
  if (!props.hasOwnProperty(propName))
  {
    return new Error(`"${propName}" is missing`);
  }

  const players = props[propName];
  if (!(players instanceof Set))
  {
    return new Error(`"${propName}" must be a Set`);
  }

  for (const player of players)
  {
    if (typeof player !== 'string')
    {
      return new Error(`"${propName}": All the elements must be strings`);
    }
  }
};

const numberOrString = (props, propName) =>
{
  if (!props.hasOwnProperty(propName))
  {
    return new Error(`"${propName}" is missing`);
  }

  const value = props[propName];
  if (typeof value !== 'string' && typeof value !== 'number')
  {
    return new Error(`"${propName}" should be either string or number`);
  }
};

const POST_MATCH_FIELDS =
{
  date: PropTypes.string.isRequired,
  setStateDate: PropTypes.func.isRequired,
  teams: PropTypes.arrayOf(PropTypes.exact(
      {
        // It can be an empty string when the
        // page just loaded.
        result: numberOrString,
        squad: PropTypes.arrayOf(PropTypes.string).isRequired,
      },
  )).isRequired,
  setStateTeams: PropTypes.func.isRequired,
  cachedPlayers: cachedPlayersValidator,
};

const ELO_ARRAY_ELEMENT_FIELDS =
{
  'date': PropTypes.string.isRequired,
  'event_number': PropTypes.number.isRequired,
  'rating': PropTypes.number.isRequired,
  'result': PropTypes.string,
};
const ELO_ARRAY_SCHEMA = PropTypes.arrayOf(PropTypes.exact(
    ELO_ARRAY_ELEMENT_FIELDS));


const exportDefault =
{
  ELO_ARRAY_SCHEMA,
  EVENT_SCHEMA,
  MAIN_STAT_SCHEMA,
  POST_MATCH_FIELDS,
  RESULT_SUMMARY_FIELDS_OPTIONAL,
  RESULT_SUMMARY_FIELDS_REQUIRED,
  SEARCH_PARAMS_SCHEMA,
};
export default exportDefault;
