'use strict';

const babylon = require('babylon');
const template = require('babel-template');
const compileParameters = require('../compileParameters');
const util = require('util');

function script (activity, blockStack, index) {
  const blockStatement = blockStack[index];
  let buildWrappedScript;
  if (index === 0) {
    // wrap as an initial activity. TODO: extract this to a shared logic between activities.
    buildWrappedScript = template(`
      return Promise.resolve({
        parameters: SCRIPT_PARAMETERS
      })
      .then(context => SCRIPT_BODY)
    `);
  } else {
    buildWrappedScript = template(`
      return Promise.resolve({
        parameters: SCRIPT_PARAMETERS
      })
      .then(context => SCRIPT_BODY)
    `);
  }

  const ast = buildWrappedScript({
    SCRIPT_PARAMETERS: compileParameters(activity.parameters),
    SCRIPT_BODY: babylon.parse(activity.code).program.body[0].expression.body
  });

  blockStatement.body.push(ast);
  blockStack.push(blockStatement);
  console.log(index + ' ------->');
  console.log(util.inspect(blockStatement, false, null));
}

module.exports = script;
