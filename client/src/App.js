import React, { Component } from 'react';
import Tone from 'tone';

import './App.css';
import { connect } from 'react-redux';
import { playNote, stopNote} from './redux/actions';
import Header from './components/header.js';
import Keyboard from './components/keyboard.js';
import allKeys from './keys/key-values.js';
class App extends Component {


  constructor (props) {
    super(props);
    const synth = new Tone.PolySynth(108, Tone.AMSynth).toMaster();
    const allNotes = allKeys;
    this.state = {
      synth,
      allNotes,
    };
  }

  toggleSound (note) {

    // console.log(note);
    // console.log(this.state.allOscilators);
    // console.log(this.state.allOscilators[note]);

    let index = this.props.activeKeys.indexOf(note);
    if (index < 0) {
      this.props.playNote(note);
      this.state.synth.triggerAttack(note);

    } else {
      this.props.stopNote(note);
      this.state.synth.triggerRelease(note);

    }

  }

  render () {
    console.log(this.props.activeKeys);
    console.log(this.state);
    return (
      <div className="App">
        <Header />
        <Keyboard allNotes={this.state.allNotes} onClick={note => this.toggleSound(note)}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeKeys: state.activeKeys,
});

const mapDispatchToProps = (dispatch) => ({
  playNote: (noteKey) => {
    dispatch(playNote(noteKey));
  },
  stopNote: (noteKey) => {
    dispatch(stopNote(noteKey));
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
