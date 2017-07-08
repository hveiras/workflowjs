'use strict';

const compile = require('../lib/compile');
const expect = require('chai').expect;
const getDefinition = require('./definitions/getDefinition');

describe('Compile', () => {
  it('should fail to compile program with no activities', () => {
    const def = getDefinition('no-activities.json');
    expect(() => compile(def)).to.throw(Error, 'Program must have at least one activity');
  });

  it.only('should compile program with script activity', () => {
    const def = getDefinition('simple-script-activity.json');
    console.log(compile(def));
  });

  it('should compile program activity', () => {
    const definition = {
      "name": "addOrUpdateCustomer",
      "type": "program",
      "parameters": {
        "firstName": {
          "required": true,
          "type": "string"
        },
        "lastName": {
          "required": true,
          "type": "string"
        },
        "customerId": {
          "required": false,
          "default": "",
          "type": "string"
        }
      },
      "activities": [
        {
          "name": "isAdd",
          "type": "branch",
          "exp": "isNilOrEmpty($(params).customerId)",
          "true": [
            {
              "name": "addCustomer",
              "type": "asyncCall",
              "identifier": "callEndpoint",
              "args": {
                "_endpoint": "addcustomer",
                "firtName": "$(params).firstName",
                "lastName": "$(params).lastName"
              }
            }
          ],
          "false": [
            {
              "name": "updateCustomer",
              "type": "asyncCall",
              "identifier": "callEndpoint",
              "args": {
                "_endpoint": "updatecustomer",
                "firtName": "$(params).firstName",
                "lastName": "$(params).lastName",
                "customerId": "$(params).customerId"
              }
            }
          ]
        }
      ]
    };

    console.log(compile(definition));
  });
})