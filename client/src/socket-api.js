import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3000');
function subscribeToTimer (cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}

function sendUserInput (userInput) {
  socket.emit('userInput', userInput);
}

export {
  subscribeToTimer,
  sendUserInput
};
