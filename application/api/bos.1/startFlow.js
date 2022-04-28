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
      console.log({ step });
      if (step.command === 'Form `Order`') {
        const form = model.entities.get('OrderForm').fields;
        context.client.emit('bos/form', { step, form });
      }
      if (step.command === 'Form `Payment`') {
        const form = model.entities.get('PaymentForm').fields;
        context.client.emit('bos/form', { step, form });
      }
      console.log({ 'form/show': step });
    });

    flow.exec(name).catch((err) => {
      console.error(err);
      context.client.emit('bos/error', err);
    });

    domain.runtime.flows.set(context.client, flow);
    domain.runtime.clients.set(flow, context.client);

    return { success: true };
  },
});
