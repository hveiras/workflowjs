function main (_args) {
  if (!_args.parameters['param1']) throw Error('Missing required parameter param1');
  if (!_args.parameters['param2']) throw Error('Missing required parameter param2');
  const _pipeline = [];
  _pipeline.push(() => Promise.resolve({
    input: {},
    output: {}
  }));

  _pipeline.push(context => {
    context.input = {
      param1: _args.parameters['param1'], 
      param2: _args.parameters['param2']
    };
    const script = context => { return context.input.param1 + ' ' + context.input.param2; };
    return {
      output: Object.assign(context.output, { 'concat-params': script(context) })
    };
  });

  return R.pipeP(_pipeline[0], _pipeline[1])();
}
