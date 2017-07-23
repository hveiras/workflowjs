function main (args) {
  if (!args.parameters['param1']) throw Error('Missing required parameter param1');
  if (!args.parameters['param2']) throw Error('Missing required parameter param2');
  return Promise.resolve({
    input: {},
    output: {}
  })
    .then(context => {
      context.input = {
        param1: args.parameters['param1'],
        param2: args.parameters['param2']
      };
      const script = context => { return context.input.param1 + ' ' + context.input.param2; };
      return {
        output: Object.assign(context.output, { 'concat-params': script(context) })
      };
    })
    .then(context => {
      context.input = {
        foo: 'bar'
      };
      const script = context => { return context.output['concat-params'].split(' '); };
      return {
        output: Object.assign(context.output, { 'split-params': script(context) })
      };
    });
}
