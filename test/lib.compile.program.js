'use strict';

const compile = require('../lib/compile');

describe('Program', () => {
  it('should compile program activity', () => {
    const definition = {
      "name": "addOrUpdateCustomer",
      "type": "program",
      "params": {
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