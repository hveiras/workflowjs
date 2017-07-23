'use strict';

const babylon = require('babylon');
const template = require('babel-template');
const compileParameters = require('../compileParameters');
const R = require('ramda');
const util = require('util');

function script (activity, mainBlockAst, path, index) {
  const buildScript = template(`
    _pipeline.push(context => {
      context.input = SCRIPT_PARAMETERS
      const script = SCRIPT
      return {
        output: Object.assign(context.output, { '${activity.name}': script(context) })
      };
    });
  `);

  const ast = R.clone(mainBlockAst);
  const node = R.view(R.lensPath(path), ast);
  node.push(buildScript({
    SCRIPT_PARAMETERS: compileParameters(activity.input),
    SCRIPT: babylon.parse(activity.output).program.body[0].expression
  }));

  return [ast, path];
}

module.exports = script;
