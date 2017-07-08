'use strict';

const t = require('babel-types');
const babylon = require('babylon');
const template = require('babel-template');
const R = require('ramda');
const compileParameters = require('../compileParameters');

function script (activity, blockStatement) {
  const buildWrappedScript = template(`
    return Promise.resolve({
      parameters: SCRIPT_PARAMETERS
    })
    .then(context => SCRIPT_BODY)
  `);

  const ast = buildWrappedScript({
    SCRIPT_PARAMETERS: compileParameters(activity.parameters),
    SCRIPT_BODY: babylon.parse(activity.code).program.body[0].expression.body
  });

  blockStatement.body.push(ast);
}

module.exports = script;
