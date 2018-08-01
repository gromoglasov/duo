const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const MidiConvert = require('midiconvert');
const numjs = require('numjs');
require('@tensorflow/tfjs-node');  // Use '@tensorflow/tfjs-node-gpu' if running with GPU.
const noteData = require('./midi-to-frequency.js').data;
const model = tf.sequential();
const promisify = require('util').promisify;
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);

async function dataOrganiser () {
  let sampleMidi;
  let fileNumber;
  const allSongData = [];

  const files = await readdir('/Users/vovafiles/Git/Codeworks/senior/duo/server/tensorflow/dataset');

  for (let i = 1; i < files.length; i++) {
    await readfile(`/Users/vovafiles/Git/Codeworks/senior/duo/server/tensorflow/dataset/${files[i]}`, 'binary')
      .then(midiBlob => {
        sampleMidi = MidiConvert.parse(midiBlob);
        allSongData.push([...dataCleaner(sampleMidi.tracks[0].notes)]);
      });
  }
  return allSongData;
}


async function start () {
  const data = await dataOrganiser();
  console.log(data);
  createModel(data);
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
let counter = 0;
function dataCleaner (allNotes) {
  //return an array freq, time, duration, velocity
  if (allNotes.length !== 0) {
    let cleanedArray = [];
    for (let i = 0; i < allNotes.length; i++) {
      let oneNoteData = [];
      for (let key in allNotes[i]) {
        // if (!noteData[allNotes[i].midi-12]) continue;
        if (key == 'midi') oneNoteData.push(noteData[allNotes[i][key]-12][allNotes[i][key]]);
        else oneNoteData.push(allNotes[i][key]);
      }
      cleanedArray.push(oneNoteData);
    }
    return cleanedArray;
  } return [];
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
  // console.log(data);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
async function fitModel (numEpochs = 128, examplesPerEpoch = 512, batchSize = 512, validationSplit = 0.99) {
  let batchCount = 0;
  const batchesPerEpoch = examplesPerEpoch / batchSize;
  const totalBatches = numEpochs * batchesPerEpoch;


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


start();
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
