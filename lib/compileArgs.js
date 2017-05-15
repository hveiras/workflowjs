'use strict';

const babylon = require('babylon');
const t = require('babel-types');

function compileArgs (exp) {
  const replaceParams = exp => exp.replace('$(params)', 'args.params');

  if (/\$\(params\)/.test(exp)) {
    return babylon.parse(replaceParams(exp)).program.body[0].expression;
  }

  return t.stringLiteral(exp);
}

module.exports = compileArgs;
