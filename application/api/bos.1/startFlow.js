({
  access: 'public',

  async method({ name }) {
    context.client.on('close', () => {
      clients.delete(context.client);
    });

    const proc = domain.runtime.flows.get(name);
    const flow = await npm.lowscript.startProcess(proc);

    flow.on('step', (step) => {
      context.client.emit('demo/step', { step });
    });

    domain.flow.processes.set(context.client, instance);
    domain.flow.clients.set(instance, context.client);

    return { success: true };
  },
});
