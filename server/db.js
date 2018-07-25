'use strict';

const mongoose = require('mongoose');
const db = {};

db.connection = mongoose.connect('mongodb://localhost/duo', (err) => {
  if(err) console.log(err);
  else console.log('MongoBase has conected, to duo database')
});

module.exports = db;
