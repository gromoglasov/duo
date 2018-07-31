const fs = require('fs');
const MidiConvert = require('midiconvert');
const numjs = require('numjs');

function dataOrganiser () {
  let sampleMidi;
  let myData;
  fs.readFile('/Users/vovafiles/Desktop/duoTraining/trial.mid', 'binary', function (err, midiBlob) {
    if (!err) {
      sampleMidi = MidiConvert.parse(midiBlob);
    }
    console.log("some" + myData);
    myData = dataCleaner(sampleMidi.tracks[0].notes);

    // createModel(sampleMidi);
    // compileModel(0.01);
  });
  return myData;
}

function dataCleaner (allNotes) {
  let allNotesFromTrack = allNotes;
  let cleanedArray = [];
  for (let i = 0; i < allNotesFromTrack.length; i++) {
    let oneNoteData = [];
    for (let key in allNotesFromTrack[i]) {
      oneNoteData.push(allNotesFromTrack[i][key]);
    }
    cleanedArray.push(oneNoteData);
  }
  return cleanedArray;
}

module.exports = dataOrganiser;
