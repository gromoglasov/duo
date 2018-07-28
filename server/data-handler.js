const converter = require('./scribbletune/index.js');

let allUserInput = {};
let twoSeconds = [];
let startTime;
let currentTime;
exports.connectUser = (client) => {
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });
  client.on('userInput', (userInput) => {
    allUserInput = userInput;
    console.log(allUserInput);
    console.log(converter.convert);
    // console.log(allUserInput);
    // let interval = dataCutter(allUserInput);
    // if (interval) console.log(interval);
  });
};
