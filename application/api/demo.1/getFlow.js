({
  access: 'public',
  async method({ name }) {
    const filePath = `./application/flow/${name}.md`;
    const buffer = await node.fs.promises.readFile(filePath);
    if (!buffer) return new Error('Content is not found');
    return { text: buffer.toString() };
  },
});
