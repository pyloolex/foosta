import React from 'react';
import './users.css';


class AddUser extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      added_user: {
        name: '',
        salary: 0,
        married: false,
      }
    };
  }

  handleName = (text) => {
    console.log(this.state);

    const { added_user } = this.state;
    added_user.name = text.target.value;

    this.setState({
      added_user: added_user,
    });
  }

  handleSalary = (number) => {
    console.log(this.state);

    const { added_user } = this.state;
    added_user.salary = number.target.value;

    this.setState({
      added_user: added_user,
    });
  }

  handleMarital = (marital) => {
    console.log(this.state);

    const { added_user } = this.state;
    added_user.married = marital.target.value === "married";

    this.setState({added_user});
  }

  handleAddition = () => {
    const { added_user } = this.state;
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: added_user.name,
        salary: added_user.salary,
        married: added_user.married,
      }),
    };
    console.log(requestOptions);
    fetch('/api', requestOptions).then(
      response => response.json()
    ).then(
      data => {
        console.log(data);
        this.props.fetchList();
      }
    );
  }

  render()
  {
    return (
      <div>
        <input type="text"
               onChange={(text) => this.handleName(text)} />
        <input type="number"
               onChange={(number) => this.handleSalary(number)} />
        <select onChange={(marital) => this.handleMarital(marital)}>
          <option value="single">single</option>
          <option value="married">married</option>
        </select>
        <button onClick={this.handleAddition}>Add new man</button>
      </div>
    );
  }
}


class UserList extends React.Component {
  componentDidMount()
  {
    this.props.fetchList();
  }

  render() {
    return (
        <div className="home">
          <h1>This must be the home</h1>
          {this.props.items.map((elem, idx) => (
            <p key={idx}>
              {elem.username},
              {elem.salary},
              {elem.married ? 'true' : 'false'}
            </p>
          ))}
        </div>
    );
  }
}


class Home extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      items: [],
    };
  }

  handleFetchedList = (response) => {
    const items = response.items;
    this.setState({items});
    console.log('Fetched items:', items);
  }

  fetchList = () => {
    fetch('/api').then(
      response => response.json()).then(
        responseJson => this.handleFetchedList(responseJson));
  };

  render()
  {
    return (
      <div>
        <AddUser fetchList={this.fetchList} />
        <UserList fetchList={this.fetchList}
                  items={this.state.items}
        />
      </div>
    );
  }
}

const export_default = {
  Home,
}
export default export_default;
