'use strict';

const fs = require('fs');
const path = require('path');

function getDefinition (fileName) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, fileName), 'utf8'));
}

module.exports = getDefinition;
