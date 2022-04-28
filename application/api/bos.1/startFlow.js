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

    flow.on('step', (step) => {
      context.client.emit('bos/step', { step });
    });

    flow.on('notify', (step) => {
      context.client.emit('bos/notify', { step });
      console.log({ step });
    });

    flow.on('invoke', (data) => {
      context.client.emit('bos/invoke', { invoke: data });
      console.log({ invoke: data });
    });

    flow.on('form/show', (step) => {
      console.log({ model });
      const form = model.entities.get('OrderForm').fields;
      context.client.emit('bos/form', { step, form });
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
