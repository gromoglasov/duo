import React, { Component } from 'react';
import Octave from './octave.js';
class Keyboard extends Component {

  render () {

    return (
      <div className="Keyboard">
        <Octave notes={this.props.allNotes[3]} onClick={note => this.props.onClick(note)}/>
        <Octave notes={this.props.allNotes[4]} onClick={note => this.props.onClick(note)}/>
        <Octave notes={this.props.allNotes[5]} onClick={note => this.props.onClick(note)}/>
      </div>

    );
  }
}



export default Keyboard;
