import React, { Component } from 'react';
import Tone from 'tone';
import openSocket from 'socket.io-client';
import './App.css';
import { connect } from 'react-redux';
import { playNote, stopNote, moveUp, moveDown } from './redux/actions';
import Header from './components/header.js';
import Keyboard from './components/keyboard.js';
import allKeys from './keys/key-values.js';
class App extends Component {

  constructor (props) {
    super(props);
    const synth = new Tone.PolySynth(108, Tone.AMSynth).toMaster();
    const allNotes = allKeys;
    const socket = openSocket('http://localhost:3000');
    console.log(socket);
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

  componentDidMount () {
    window.document.addEventListener('keydown', (e) => {
      if (!e.repeat) this.toggleSound(this.props.activeKeyboardKeys[e.keyCode]);
    });
    window.document.addEventListener('keyup', (e) => {
      this.toggleSound(this.props.activeKeyboardKeys[e.keyCode]);
    });
  }

  // componentWillUnmount () {
  //   window.document.removeEventListener('keydown', this.mapKeys);
  // }

  render () {
    // console.log(this.props.activeKeys);
    // console.log(this.state);
    return (
      <div className="App" onKeyPress={(e) => console.log(e)}>
        <Header />
        <Keyboard allNotes={this.state.allNotes} onClick={note => this.toggleSound(note)}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeKeys: state.activeKeys,
  activeKeyboardKeys: state.activeKeyboardKeys
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
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
