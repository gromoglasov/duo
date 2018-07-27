'use strict';
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const app = new Koa();
const IO = require( 'koa-socket' );
const io = new IO();

require('./db.js');

const PORT = 3000;

app
  .use(cors())
  .use(bodyParser());

io.attach( app );

app._io.on('connection', (client) => {
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });
});

app.listen(PORT, function () {
  console.log(`server listening on ${PORT}`);
});
