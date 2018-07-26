import React, { Component } from 'react';
import NoteKey from './note-key.js';

class Octave extends Component {

  renderNotes = () => {
      return this.props.notes.map(note => (<NoteKey key={note.name} type={note.type} onClick={() => this.props.onClick(note.freq)}/>));
  };

  render () {
    return (
      <div className="Octave">
        {this.renderNotes()}
      </div>
    );
  }
}



export default Octave;
