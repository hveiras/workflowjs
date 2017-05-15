'use strict';

const t = require('babel-types');
const generate = require('babel-generator').default;
const template = require('babel-template');
const babylon = require('babylon');
const util = require('util');
const R = require('ramda');
const a = require('./activities');

function compile(def) {
  const buildProgram = template(`
    (function PROGRAM_NAME (args) {});
  `);

  const ast = buildProgram({
    PROGRAM_NAME: t.identifier('main')
  });

  const requiredParams = R.pickBy((val, key) => val.required, def.params);
  const mainBlockStatement = t.blockStatement([]);

  R.append(R.mapObjIndexed((num, key, obj) => {
    const buildRequiredParamAssert = template(`
      if (!args.params[PARAM_NAME]) throw Error(ERROR_MESSAGE);
    `);
    const ast = buildRequiredParamAssert({
      PARAM_NAME: t.stringLiteral(key),
      ERROR_MESSAGE: t.stringLiteral(`Missing required parameter ${key}`)
    });
    mainBlockStatement.body.push(ast);
  }, requiredParams), []);

  R.map(x => {
    R.cond([
      [R.equals('branch'), () => a.branch(x, mainBlockStatement)],
      [R.T, () => { throw Error('Invalid activity type'); }]
    ])(x.type);
  }, def.activities);

  ast.expression.body = mainBlockStatement;
  return generate(ast).code;
}

module.exports = compile;
