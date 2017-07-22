'use strict';

const babylon = require('babylon');
const template = require('babel-template');
const compileParameters = require('../compileParameters');
const R = require('ramda');
const util = require('util');

function script (activity, mainBlockAst, path) {
  const buildScript = template(`
    async.apply(SCRIPT_BODY, context)
  `);

  const ast = R.clone(mainBlockAst);
  const node = R.view(R.lensPath(path), ast);
  node.push(buildScript({
    SCRIPT_BODY: babylon.parse(activity.output).program.body[0].expression
  }));
  // console.log(util.inspect(babylon.parse(activity.output).program.body[0].expression.body.body[0].argument, false, null));

  return [ast, R.concat(path, ['changeme'])];
  // const ast = buildWrappedScript({
  //   SCRIPT_PARAMETERS: compileParameters(activity.parameters),
  //   SCRIPT_BODY: babylon.parse(activity.code).program.body[0].expression.body
  // });
}

module.exports = script;
