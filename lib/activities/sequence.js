'use strict';

const template = require('babel-template');
const R = require('ramda');

function sequence (activity, mainBlockAst, path, index, activityCount) {
  const buildSequence = template(`
    __pipeline.push(() => Promise.resolve({
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

  return [ast, path, ++activityCount];
}

module.exports = sequence;
