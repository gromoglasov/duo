'use strict';

const scribble = require('scribbletune');
console.log(scribble.chords());
let chords = scribble.clip({
  notes: 'F#m C#m DM Bm EM AM',
  pattern: 'x_x_x_x--'.repeat(8),
  sizzle: true
});

// scribble.midi(chords, './midi-files/chords2.mid');
