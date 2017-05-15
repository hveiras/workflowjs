'use strict';

const t = require('babel-types');
const babylon = require('babylon');
const asyncCall = require('./asyncCall');
const R = require('ramda');

function branch (activity, blockStatement) {
  const expressionString = activity.exp.replace('$(params)', 'args.params');

  const trueStatement = t.blockStatement([]);
  const falseStatement = t.blockStatement([]);

  // compile true branch.
  R.map(x => {
    R.cond([
      [R.equals('asyncCall'), () => asyncCall(x, trueStatement)],
      [R.T, () => { throw Error('Invalid activity type'); }]
    ])(x.type);
  }, activity.true);

  // compile false branch.
  R.map(x => {
    R.cond([
      [R.equals('asyncCall'), () => asyncCall(x, falseStatement)],
      [R.T, () => { throw Error('Invalid activity type'); }]
    ])(x.type);
  }, activity.false);

  blockStatement.body.push(t.ifStatement(
    babylon.parse(expressionString).program.body[0].expression,
    trueStatement,
    falseStatement
  ));
}

module.exports = branch;
