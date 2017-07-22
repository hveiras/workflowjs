'use strict';

const fs = require('fs');
const path = require('path');

module.exports = fileName => JSON.parse(fs.readFileSync(path.join(__dirname, fileName), 'utf8'));
