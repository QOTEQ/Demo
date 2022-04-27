async () => {
  domain.runtime.clients = new Map();
  domain.runtime.processes = new Map();
  domain.runtime.flows = new Map();

  const dirPath = './application/flow/';
  const files = await node.fsp.readdir(dirPath);
  for (const file of files) {
    const name = node.path.basename(file, '.md');
    await domain.runtime.load({ name });
  }
};
