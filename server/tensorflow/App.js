import React, { Component } from 'react';
import Tone from 'tone';
import './App.css';
import { connect } from 'react-redux';
import { playNote, stopNote, moveUp, moveDown, record } from './redux/actions';
import { subscribeToTimer, sendUserInput } from './socket-api';
import Header from './components/header.js';
import Keyboard from './components/keyboard.js';
import allKeys from './keys/key-values.js';
class App extends Component {

  constructor (props) {
    super(props);
    const synth = new Tone.PolySynth(108, Tone.AMSynth).toMaster();
    const allNotes = allKeys;
    subscribeToTimer((err, timestamp) => this.setState({
      timestamp
    }));

    this.state = {
      synth,
      allNotes,
      timestamp: 'no timestamp yet',
    };
  }

  componentDidUpdate (prevProps) {
    //
    // if (this.props.recording === true) {
    //   console.log('changed!');
    //   sendUserInput(this.props.userInput);
    // }
  }

  record () {
    this.props.record();
  }

  sendLoop () {
    sendUserInput(this.props.userInput);
  }

  toggleSound (note) {
    if (note) {
      let index = this.props.activeKeys.indexOf(note);
      if (index < 0) {
        this.props.playNote(note);
        this.state.synth.triggerAttack(note);
      } else {
        this.props.stopNote(note);
        this.state.synth.triggerRelease(note);
      }
      // console.log(this.props.recording);
    }
  }

  componentDidMount () {
    window.document.addEventListener('keydown', (e) => {
      if (!e.repeat) this.toggleSound(this.props.activeKeyboardKeys[e.keyCode]);
    });
    window.document.addEventListener('keyup', (e) => {
      this.toggleSound(this.props.activeKeyboardKeys[e.keyCode]);
    });
  }

  render () {
    // console.log(this.props.activeKeys);
    // console.log(this.props.lastTwoSeconds);
    return (
      <div className="App">
        <Header time={this.state.timestamp} record={() => this.record()} sendLoop={() => this.sendLoop()}/>
        <Keyboard allNotes={this.state.allNotes} onClick={note => this.toggleSound(note)}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeKeys: state.activeKeys,
  activeKeyboardKeys: state.activeKeyboardKeys,
  userInput: state.userInput,
  recording: state.recording
});

const mapDispatchToProps = (dispatch) => ({
  playNote: (noteKey) => {
    dispatch(playNote(noteKey));
  },
  stopNote: (noteKey) => {
    dispatch(stopNote(noteKey));
  },
  moveUp: (changeArr) => {
    dispatch(moveUp(changeArr));
  },
  moveDown: (changeArr) => {
    dispatch(moveDown(changeArr));
  },
  record: () => {
    dispatch(record());
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
