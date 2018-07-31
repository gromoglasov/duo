import React, { Component } from 'react';

class Header extends Component {
  render () {
    return (
      <div className="Header">
        <h1>This is DUO</h1>
        <button onClick={this.props.record}>Record!</button>
        <button onClick={this.props.sendLoop}>Send!</button>
      </div>
    );
  }
}

export default Header;
