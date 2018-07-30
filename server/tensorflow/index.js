const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const MidiConvert = require('midiconvert');
// Load the binding:
require('@tensorflow/tfjs-node');  // Use '@tensorflow/tfjs-node-gpu' if running with GPU.

let sampleMidi;

fs.readFile('/Users/vovafiles/Desktop/duoTraining/trial.mid', 'binary', function (err, midiBlob) {
  if (!err) {
    sampleMidi = MidiConvert.parse(midiBlob);
  }
  // console.log(sampleMidi);
  console.log(sampleMidi.tracks[0].notes.length);
  createModel(sampleMidi.tracks[0].notes.length*2);
  compileModel(0.01);
})

let model = tf.sequential();
//
function createModel (lstmLayerSizes) {
  if (!Array.isArray(lstmLayerSizes)) {
    lstmLayerSizes = [lstmLayerSizes];
  }

  for (let i = 0; i < lstmLayerSizes.length; i++) {
    const lstmLayerSize = lstmLayerSizes[i];
    model.add(tf.layers.lstm({
      units: lstmLayerSize,
      returnSequences: i < lstmLayerSizes.length - 1,
      inputShape: i === 0 ? [sampleMidi.tracks[0].notes.length, sampleMidi.tracks[0].notes.length] : undefined //take 2 params to determine input matrix
    }));
  }
  model.add(
    tf.layers.dense({units: sampleMidi.tracks[0].notes.length, activation: 'softmax'}));
  console.log('seems to have created a magnificent LSTM');
}

/**
 * Compile model for training.
 *
 * @param {number} learningRate The learning rate to use during training.
 */
function compileModel (learningRate) {
  const optimizer = tf.train.rmsprop(learningRate);
  model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy'});
  console.log(`Compiled model with learning rate ${learningRate}`);
  model.summary();
}
//
// createModel(sampleMidi.notes.length*4);
// compileModel(0.01);

// Train a simple model:


// function buildNetwork (self) {
//
// }
//
//
//
// const model = tf.sequential();
// model.add(tf.layers.dense({units: 100, activation: 'relu', inputShape: [10]}));
// model.add(tf.layers.dense({units: 1, activation: 'linear'}));
// model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
//
// const xs = tf.randomNormal([100, 10]);
// const ys = tf.randomNormal([100, 1]);
//
// model.fit(xs, ys, {
//   epochs: 100,
//   callbacks: {
//     onEpochEnd: async (epoch, log) => {
//       console.log(`Epoch ${epoch}: loss = ${log.loss}`);
//     }
//   }
// });

// buildNetwork();

module.exports = model;
