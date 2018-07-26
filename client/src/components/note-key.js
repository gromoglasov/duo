import React, { Component } from 'react';

class NoteKey extends Component {

  render () {
    return (
      <div className={this.props.type} onMouseDown={this.props.onClick} onMouseUp={this.props.onClick}>
      </div>
    );
  }
}



export default NoteKey;
