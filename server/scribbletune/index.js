'use strict';
const fs = require('fs');
const scribble = require('scribbletune');
const MidiConvert = require('midiconvert');
// const tone = require('tone');

const converter = {};
let start;
let end;
const notes = {
  261.63: 'c4',
  277.18: 'c#4',
  293.66: 'd4',
  311.13: 'd#4',
  329.63: 'e4',
  349.23: 'f4',
  369.99: 'f#4',
  392.00: 'g4',
  415.30: 'g#4',
  440.00: 'a4',
  466.16: 'a#4',
  493.88: 'b4',
  523.25: 'c5',
  554.37: 'c#5',
  587.33: 'd5',
  622.25: 'd#5',
  659.25: 'e5',
  698.46: 'f5'
};
converter.convert = (userInput) => {
  let arrayOfNotes = [];
  let numberOfNotes = 0;
  let start;
  let end = 0;
  for (let key in userInput) numberOfNotes += userInput[key].length / 2;
  let tempInput = Object.assign(userInput);
  for (let i = 0, next; i < numberOfNotes; i++) {
    next = findNextNote(tempInput);
    console.log(tempInput);
    tempInput[next.note].splice(0, 2);
    arrayOfNotes.push(Object.assign(next));
  }
  console.log(start + ' ' + end)
  console.log(arrayOfNotes);
  turnToMidi(arrayOfNotes);
};


function turnToMidi (arrayOfNotes) {

  fs.readFile('/Users/vovafiles/Desktop/duoTraining/trial.mid', 'binary', function (err, midiBlob) {
    if (!err) {
      let midi = MidiConvert.parse(midiBlob);
      console.log(JSON.stringify(midi));
      fs.writeFileSync('/Users/vovafiles/Desktop/duoTraining/trial2.mid', midi.encode(), 'binary');
    }
  });


  // let file = require('fs').readFileSync('/Users/vovafiles/Git/Codeworks/senior/duo/server/scribbletune/midi-files/chords7.mid', 'binary')
  //
  // let x = midiFileParser(file);
  //
  // console.log(JSON.stringify(x));

  let duration = end - start;
  console.log(duration);
  let newNotes = [];
  let newPattern = '';
  for (let i = 0; i < arrayOfNotes.length; i++) newNotes.push(notes[arrayOfNotes[i].note]);
  for (let i = 0; i < arrayOfNotes.length; i++) {
    if (arrayOfNotes[i].duration < 200) newPattern = newPattern + 'x-';
    else newPattern = newPattern + 'x_-';
  }
  let clip = scribble.clip({
    notes: newNotes,
    pattern: newPattern.repeat(8),
  });
  scribble.midi(clip, '/Users/vovafiles/Git/Codeworks/senior/duo/server/scribbletune/midi-files/chords7.mid');
}


function findNextNote (userInput) {
  let tempNote, tempNoteStart, tempNoteEnd;
  for (let key in userInput) {
    if ((userInput[key][0] < tempNoteStart || !tempNote) && userInput[key][0]) {
      if (!tempNote && !start) start = userInput[key][0];
      console.log(start);
      tempNote = key;
      tempNoteStart = userInput[key][0];
      tempNoteEnd = userInput[key][1];
      if (!end || end < tempNoteEnd) end = tempNoteEnd;
    }
  }
  console.log(tempNote)
  return {note: tempNote, duration: tempNoteEnd - tempNoteStart};
}


module.exports = converter;
