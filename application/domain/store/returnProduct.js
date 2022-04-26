async ({ order }) => {
  const { productId, amount } = order;
  const returnProduct = { productId, amount };
  await db.pg.insert('Return', returnProduct);
  const value = await db.pg.scalar('Product', ['amount'], { productId });
  await db.pg.update('Product', { productId }, { amount: value + amount });
  return returnProduct;
};
