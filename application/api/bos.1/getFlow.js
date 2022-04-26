({
  access: 'public',

  async method({ name }) {
    const filePath = `./application/flow/${name}.md`;
    const source = await node.fs.promises.readFile(filePath, 'utf8');
    return { name, source };
  },
});
