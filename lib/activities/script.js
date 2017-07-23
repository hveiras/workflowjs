'use strict';

const babylon = require('babylon');
const template = require('babel-template');
const compileParameters = require('../compileParameters');
const R = require('ramda');

function script (activity, mainBlockAst, path, index, activityCount) {
  const buildScript = template(`
    __pipeline.push(context => {
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

  return [ast, path, ++activityCount];
}

module.exports = script;
