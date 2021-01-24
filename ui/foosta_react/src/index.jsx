import React from 'react';
import ReactDOM from 'react-dom';


class Home extends React.Component {
  render() {
    return (
        <div className="home">
          <h1>This must be the home</h1>
        </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Home />,
  document.getElementById('root')
);
