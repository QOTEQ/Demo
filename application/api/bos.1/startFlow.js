({
  access: 'public',

  async method({ name }) {
    context.client.on('close', () => {
      domain.runtime.clients.delete(context.client);
    });

    const { processes } = domain.runtime;
    const procedures = domain.store;
    const { model } = application.schemas;
    const { Runtime } = npm.lowscript;
    const flow = new Runtime({ processes, procedures, model });
    //console.log({ flow });

    flow.on('step', (step) => {
      context.client.emit('demo/step', { step });
    });

    flow.on('notify', (step) => {
      context.client.emit('notify', { step });
      console.log({ step });
    });

    flow.on('invoke', (data) => {
      context.client.emit('invoke', { invoke: data });
      console.log({ invoke: data });
    });

    flow.on('form/show', (step) => {
      context.client.emit('bos/form', { step });
      console.log({ 'form/show': step });

      let data = {};
      if (step.command === 'Form `Order`') {
        data = {
          product: 'Motorola Edge 20 Pro',
          carrier: 'Postal service',
          amount: 2,
        };
      }
      if (step.command === 'Form `Payment`') {
        data = {
          amount: 20000,
        };
      }
      flow.emit('form/submit', data);
    });

    await flow.exec(name).catch((err) => {
      console.error(err);
      context.client.emit('flows/error', err);
    });

    // set is not a function
    // Runtime.prototype.processes = {} -> lowscript/runtime.js
    // domain.runtime.processes.set(context.client, flow);
    console.dir({ processes: domain.runtime.processes });
    domain.runtime.clients.set(flow, context.client);

    return { success: true };
  },
});
