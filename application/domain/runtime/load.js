async ({ name }) => {
  const filePath = `./application/flow/${name}.md`;
  const src = await node.fsp.readFile(filePath, 'utf8');
  const procedures = npm.lowscript.parseProcess(src);
  for (const proc of procedures) {
    domain.runtime.flows.set(proc.name, proc);
  }
};
