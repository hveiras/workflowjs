'use strict';

const t = require('babel-types');
const generate = require('babel-generator').default;
const template = require('babel-template');
const R = require('ramda');
const a = require('./activities');

function compile (def) {
  const buildProgram = template(`
    (function PROGRAM_NAME (args) {});
  `);

  const ast = buildProgram({
    PROGRAM_NAME: t.identifier('main')
  });

  const requiredParams = R.pickBy((val, key) => val.required, def.parameters);
  let mainBlockAst = t.blockStatement([]);

  R.append(R.mapObjIndexed((num, key, obj) => {
    const buildRequiredParamAssert = template(`
      if (!args.parameters[PARAM_NAME]) throw Error(ERROR_MESSAGE);
    `);
    const ast = buildRequiredParamAssert({
      PARAM_NAME: t.stringLiteral(key),
      ERROR_MESSAGE: t.stringLiteral(`Missing required parameter ${key}`)
    });
    mainBlockAst.body.push(ast);
  }, requiredParams), []);

  if (R.isEmpty(def.root)) throw Error('Program must have at least one activity');

  if (def.root.type !== 'waterfall' && def.root.type !== 'parallel') {
    throw Error(`Invalid root activity type: "${def.root.type}". Activity must be a control flow type.`);
  }

  const traverse = (activity, ast, path) => {
    console.log(activity.type);

    const [astNew, pathNew] = R.cond([
      [R.equals('waterfall'), () => a.waterfall(activity, ast, path)],
      [R.equals('script'), () => a.script(activity, ast, path)],
      [R.equals('scatterGather'), () => {}],
      [R.equals('switch'), () => {}],
      [R.equals('log'), () => {}],
      [R.T, type => { throw Error(`Invalid activity type: "${type}"`); }]
    ])(activity.type);

    mainBlockAst = astNew;

    if (!activity.activities) return;

    R.map(x => traverse(x, astNew, pathNew), activity.activities);
  };

  traverse(def.root, mainBlockAst, ['body']);

  ast.expression.body = mainBlockAst;
  return generate(ast).code;
}

module.exports = compile;
