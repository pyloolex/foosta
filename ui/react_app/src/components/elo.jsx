import React from 'react';
import './elo.css';
import '../index.css';
import { Link } from 'react-router-dom';


class Elo extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      sorting: [{column: 'elo', type: -1}],
      data: {},
    };
  }

  componentDidMount()
  {
    this.fetchElo();
  }

  fetchElo = () => {
    fetch('/api/stats/elo').then(
      response => response.json()).then(
        responseJson => this.handleFetchedElo(responseJson));
  };

  handleFetchedElo = (responseJson) =>
  {
    this.setState({data: responseJson.items});
  };

  dataCustomSort = () =>
  {
    const data = [];
    for (let player in this.state.data)
    {
      data.push({
        player: player,
        participated: this.state.data[player].participated,
        elo: this.state.data[player].elo,
      });
    }

    data.sort((a, b) =>
      {
        for (let param of this.state.sorting)
        {
          if (a[param.column] !== b[param.column])
          {
            if (a[param.column] > b[param.column])
            {
              return param.type;
            }
            return -param.type;
          }
        }
        return 0;
      }
    );

    return data;
  };

  compileData = () =>
  {
    const response = [];
    const data = this.dataCustomSort();
    for (let idx in data)
    {
      response.push(
        <React.Fragment key={'fragment' + idx}>
          <div className="cell data-cell number">{parseInt(idx) + 1}</div>
          <div className="cell data-cell player"
               key={'player' + data[idx].player}
          >
            <p className="player-name"
               key={'player_name' + data[idx].player}>
              <Link to={`/stats/${data[idx].player}`}>{data[idx].player}</Link>
            </p>
          </div>
          <div className="cell data-cell participated"
               key={'participated' + data[idx].player}
          >
            {data[idx].participated}
          </div>
          <div className="cell data-cell elo" key={'elo' + data[idx].player}>
            {data[idx].elo + (data[idx].participated < 10 ? '?' : '')}
          </div>
        </React.Fragment>
      );
    }

    return response;
  };

  getSortingIcon = (column) =>
  {
    if (this.state.sorting[0].column === column)
    {
      if (this.state.sorting[0].type === 1)
      {
        return <img className="sorting-icon"
                    src="sort_up.png"
                    alt="sort_up"
               />;
      }
      return <img className="sorting-icon"
                  src="sort_down.png"
                  alt="sort_down"
             />;
    }
    return <img className="sorting-icon"
                src="sortable.png"
                alt="sortable"
                style={{'opacity': 0.2}}
           />;
  }

  handleHeaderClick = (column) =>
  {
    let cur_pos = -1;
    const list = this.state.sorting;
    for (let i in list)
    {
      if (list[i].column === column)
      {
        cur_pos = parseInt(i);
        break;
      }
    }

    if (cur_pos === 0)
    {
      list[cur_pos].type *= -1;
    }
    else
    {
      if (cur_pos !== -1)
      {
        list.splice(cur_pos, 1);
      }
      list.splice(0, 0, {column: column, type: 1});
    }

    this.setState({sorting: list});
  }

  render()
  {
    return (
      <div className="elo-container">
        <div className="cell header-cell number-header">
          N
        </div>
        <div className="cell header-cell player-header"
             onClick={() => this.handleHeaderClick('player')}>
          <div>
            Player
            {this.getSortingIcon('player')}
          </div>
        </div>
        <div className="cell header-cell participated-header"
             onClick={() => this.handleHeaderClick('participated')}>
          <div title="How many events (matches/tournaments) the player
               has taken part in.">
            Events
            {this.getSortingIcon('participated')}
          </div>
        </div>
        <div className="cell header-cell elo-header"
             onClick={() => this.handleHeaderClick('elo')}>
          <div title="The number of points based on the Elo rating system">
            Elo
            {this.getSortingIcon('elo')}
          </div>
        </div>
        {this.compileData()}
      </div>
    );
  }
}



const export_default = {
  Elo,
}
export default export_default;
