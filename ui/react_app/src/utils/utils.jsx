import React from 'react';
import './utils.css';


class ListWithAddition extends React.Component {

  render()
  {
    return (
      <div className="container-new-players">
        <div className="add-players">
          {this.props.elements.map((elem, idx) => (
            <input key={idx} autoFocus className="input-player" type="text"
                   onChange={
                     (value) => this.props.onPlayerNameChange(
                       idx, value.target.value)
                   }
            />
          ))}
        </div>
        <button className="add-input"
                onClick={this.props.onNewInput}>Add</button>
      </div>
    )
  }
}

const export_default = {
  ListWithAddition,
}
export default export_default;
