({
  access: 'public',

  async method({ name }) {
    const { clients, processes } = domain.flow;

    context.client.on('close', () => {
      clients.delete(context.client);
    });

    const filePath = `./application/flow/${name}.md`;
    const src = await node.fs.promises.readFile(filePath, 'utf8');
    const domainProcess = npm.lowscript.parseProcess(src);
    const instance = await npm.lowscript.startProcess(domainProcess);

    instance.on('step', (step) => {
      context.client.emit('demo/step', { step });
    });

    processes.set(context.client, instance);
    clients.set(instance, context.client);

    return { success: true };
  },
});
