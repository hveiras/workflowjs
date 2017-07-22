'use strict';

const babylon = require('babylon');
const template = require('babel-template');
const compileParameters = require('../compileParameters');
const R = require('ramda');
const util = require('util');

function waterfall (activity, mainBlockAst, path) {
  const buildWaterfall = template(`
    async.waterfall([
      
    ], function (err, result) {

    });
  `);

  const ast = R.clone(mainBlockAst);
  const node = R.view(R.lensPath(path), ast);
  node.push(buildWaterfall());

  return [ast, R.concat(path, [2, 'expression', 'arguments', 0, 'elements'])];
}

module.exports = waterfall;
