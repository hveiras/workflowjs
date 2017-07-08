'use strict';

const babylon = require('babylon');
const template = require('babel-template');
const t = require('babel-types');
const R = require('ramda');

function compileParameters (params) {
  const parametersAst = [];
  R.mapObjIndexed((num, key, obj) => {
    const exp = obj[key];
    const buildParameterExp = template(`
      args.parameters[PARAM_NAME]
    `);

    if (/@parameters\('.*?'\)/g.test(exp)) {
      const paramName = exp.match(/'(.*?)'/)[1];
      parametersAst.push(t.objectProperty(
        t.identifier(key),
        buildParameterExp({
          PARAM_NAME: t.stringLiteral(paramName)
        }).expression
      ));
    } else {
      parametersAst.push(t.objectProperty(
        t.identifier(key),
        t.stringLiteral(exp)
      ));
    }
  }, params);

  return t.objectExpression(parametersAst);
}

module.exports = compileParameters;
