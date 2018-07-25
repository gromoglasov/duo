'use strict';
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
require('./db.js');

const app = new koa();
const PORT = 3000;

app
  .use(cors())
  .use(bodyParser())
  .listen(PORT);

console.log(`server listening on port ${PORT}`);
