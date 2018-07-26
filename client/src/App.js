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
    let synth = new Tone.Synth().toMaster();
    console.log(synth);
    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease('C4', '8n');

    super(props);
    // create web audio api context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const allNotes = allKeys;
    this.state = {
      audioCtx,
      allNotes,
    };
    const allOscilators = this.renderOscilators()[0];
    const allGainNodes = this.renderOscilators()[1];
    this.state = {
      audioCtx,
      allNotes,
      allOscilators,
      allGainNodes
    };
  }

  renderOscilators () {
    let arr = [];
    let oscillatorsObj = {};
    let gainNodeObj = {};
    for (let i=0; i < allKeys.length; i++) {
      for (let k=0; k < allKeys[i].length; k++) {
        let oscillator = this.state.audioCtx.createOscillator();
        let gainNode = this.state.audioCtx.createGain();
        oscillator.connect(gainNode);

        oscillator.detune.value = 50;
        oscillator.frequency.value = allKeys[i][k].freq;
        // oscillator.type = makeDistortionCurve(50);
        oscillatorsObj[allKeys[i][k].freq] = oscillator;
        gainNodeObj[allKeys[i][k].freq] = gainNode;
        oscillator.start();
      }
    }
    arr.push(oscillatorsObj);
    arr.push(gainNodeObj);
    return arr;
  }

  toggleSound (note) {

    console.log(note);
    console.log(this.state.allOscilators);
    console.log(this.state.allOscilators[note]);

    let index = this.props.activeKeys.indexOf(note);
    if (index < 0) {
      this.props.playNote(note);
      this.state.allGainNodes[note].connect(this.state.audioCtx.destination);
    } else {
      this.props.stopNote(note);
      this.state.allGainNodes[note].disconnect(this.state.audioCtx.destination);
    }

  }

  render () {
    console.log(this.props.activeKeys);
    console.log(this.state.activeOscilators);
    console.log(this.state);
    // this.play();
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
