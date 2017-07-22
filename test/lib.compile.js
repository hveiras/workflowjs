'use strict';

const compile = require('../lib/compile');
const expect = require('chai').expect;
const getDefinition = require('./definitions/getDefinition');

describe('Compile', () => {
  it('should fail to compile program with no activities', () => {
    const def = getDefinition('no-activities.json');
    expect(() => compile(def)).to.throw(Error, 'Program must have at least one activity');
  });

  it('should compile single script activity', () => {
    const def = getDefinition('single-script-activity.json');
    console.log(compile(def));
  });

  it.only('should compile sequence script activity', () => {
    const def = getDefinition('sequence-script-activity.json');
    console.log(compile(def));
  });
});
