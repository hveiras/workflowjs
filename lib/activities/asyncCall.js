'use strict';

const t = require('babel-types');
const babylon = require('babylon');
const R = require('ramda');
const compileArgs = require('../compileArgs');

function asyncCall(activity, blockStatement) {
  const args = [];
  R.mapObjIndexed((num, key, obj) => {
    args.push(t.objectProperty(
      t.identifier(key),
      compileArgs(obj[key])
    ));
  }, activity.args);

  const argsExpression = t.objectExpression(args);

  blockStatement.body.push(t.callExpression(
    t.identifier(activity.identifier),
    [
      argsExpression,
      t.functionExpression(null, [
        t.identifier('err'),
        t.identifier('res')
      ],
      t.blockStatement([]))
    ]
  ));
}

module.exports = asyncCall;
