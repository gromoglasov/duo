const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const MidiConvert = require('midiconvert');
const numjs = require('numjs');
require('@tensorflow/tfjs-node');  // Use '@tensorflow/tfjs-node-gpu' if running with GPU.
const noteData = require('./midi-to-frequency.js').data;
let allData;
const model = tf.sequential();

function dataOrganiser () {

  let sampleMidi;
  let path = 'trial.mid'
  fs.readFile(`/Users/vovafiles/Desktop/duoTraining/${path}`, 'binary', function (err, midiBlob) {
    if (!err) {
      sampleMidi = MidiConvert.parse(midiBlob);
    }
    console.log(noteData);
    allData = dataCleaner(sampleMidi.tracks[0].notes);
    console.log(allData);
    createModel(allData);
    // compileModel(0.01);
  });
  // return myData;
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function dataCleaner (allNotes) { //return an array freq, time, duration, velocity
  let allNotesFromTrack = allNotes;
  let cleanedArray = [];
  for (let i = 0; i < allNotesFromTrack.length; i++) {
    let oneNoteData = [];
    for (let key in allNotesFromTrack[i]) {
      if (key == 'midi') oneNoteData.push(noteData[allNotesFromTrack[i][key]-12][allNotesFromTrack[i][key]]);
      else oneNoteData.push(allNotesFromTrack[i][key]);
    }
    cleanedArray.push(oneNoteData);
  }
  return cleanedArray;
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function createModel (data) {

  model.add(tf.layers.lstm({units: 128, returnSequences: true, inputShape: [data.length, 400]}));
  model.add(tf.layers.dropout(0.2));
  model.add(tf.layers.lstm({units: 128, returnSequences: false}));
  model.add(tf.layers.dropout(0.2));
  model.add(tf.layers.dense({units: data.length, activation: 'softmax'}));
  // const optimizer = tf.train.rmsprop(learningRate);
  model.compile({optimizer: 'rmsprop', loss: 'categoricalCrossentropy'});
  console.log('model compiled');
  model.summary();

}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
async function fitModel (numEpochs = 128, examplesPerEpoch = 512, batchSize = 512, validationSplit = 0.99) {
  let batchCount = 0;
  const batchesPerEpoch = examplesPerEpoch / batchSize;
  const totalBatches = numEpochs * batchesPerEpoch;

  onTrainBegin();
  await tf.nextFrame();

  let t = new Date().getTime();
  for (let i = 0; i < numEpochs; ++i) {
    const [xs, ys] = {}; //someDataOfMine;
    await model.fit(xs, ys, {
      epochs: 1,
      batchSize: batchSize,
      validationSplit,
      callbacks: {
        onBatchEnd: async (batch, logs) => {
        // Calculate the training speed in the current batch, in # of
        // examples per second.
          const t1 = new Date().getTime();
          const examplesPerSec = batchSize / ((t1 - t) / 1e3);
          t = t1;
          onTrainBatchEnd(
            logs.loss, ++batchCount / totalBatches, examplesPerSec);
          await tf.nextFrame();
        },
        onEpochEnd: async (epoch, logs) => {
          onTrainEpochEnd(logs.val_loss);
        },
      }
    });
    xs.dispose();
    ys.dispose();
    model.save('/Users/vovafiles/Git/Codeworks/senior/duo/server/tensorflow/mymodel');
  }
}




function generateMusic () {


}
////////////////////////////////////////////////////////////////////////////////


dataOrganiser();
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////HELPERS/////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function onTrainBatchEnd (loss, progress, examplesPerSec) {
  batchCount = lossValues.length + 1;
  lossValues.push({'batch': batchCount, 'loss': loss, 'split': 'training'});
  plotLossValues();
  logStatus(
    `Model training: ${(progress * 1e2).toFixed(1)}% complete... ` +
    `(${examplesPerSec.toFixed(0)} examples/s)`);
}
////////////////////////////////////////////////////////////////////////////////
function onTrainEpochEnd (validationLoss) {
  lossValues.push(
    {'batch': batchCount, 'loss': validationLoss, 'split': 'validation'});
  plotLossValues();
}
////////////////////////////////////////////////////////////////////////////////
function plotLossValues () {
  embed(
    '#loss-canvas', {
      '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
      'data': {'values': lossValues},
      'mark': 'line',
      'encoding': {
        'x': {'field': 'batch', 'type': 'ordinal'},
        'y': {'field': 'loss', 'type': 'quantitative'},
        'color': {'field': 'split', 'type': 'nominal'}
      },
      'width': 300,
    },
    {});
}
