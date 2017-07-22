'use strict';

const compile = require('../lib/compile');
const expect = require('chai').expect;
const getDefinition = require('./definitions/getDefinition');

describe('Compile', () => {
  it('should fail to compile program with no activities', () => {
    const def = getDefinition('no-activities.json');
    expect(() => compile(def)).to.throw(Error, 'Program must have at least one activity');
  });

  it.only('should compile single activity', () => {
    const def = getDefinition('single-activity.json');
    console.log(compile(def));
  });

  it('should compile all activities', () => {
    const def = getDefinition('all-activities.json');
    console.log(compile(def));
  });
});
