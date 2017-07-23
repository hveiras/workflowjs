'use strict';

const babylon = require('babylon');
const template = require('babel-template');
const compileParameters = require('../compileParameters');
const R = require('ramda');
const util = require('util');

function sequence (activity, mainBlockAst, path, index) {
  const buildSequence = template(`
    _pipeline.push(() => Promise.resolve({
      input: {},
      output: {}
    }));
  `);

  const ast = R.clone(mainBlockAst);
  const node = R.view(R.lensPath(path), ast);

  // only if this is the first activity.
  if (index === 0) {
    node.push(buildSequence());
  }

  return [ast, path];
}

module.exports = sequence;
