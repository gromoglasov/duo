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

io.on( 'join', ( ctx, data ) => {
  console.log( 'join event fired', data )
});

app.listen(PORT, function () {
  console.log(`server listening on ${PORT}`);
});
