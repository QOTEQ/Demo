({
  access: 'public',

  async method({ name }) {
    context.client.on('close', () => {
      domain.flow.clients.delete(context.client);
    });

    const proc = domain.runtime.flows.get(name);
    const flow = await npm.lowscript.startFlow(proc);

    flow.on('step', (step) => {
      context.client.emit('demo/step', { step });
    });

    domain.flow.processes.set(context.client, flow);
    domain.flow.clients.set(flow, context.client);

    return { success: true };
  },
});
