async ({ order, product }) => {
  const { orderId, amount } = order;
  const { weight } = product;
  const postPackage = {
    orderId,
    weight: weight * amount,
  };
  await db.pg.insert('Package', postPackage);
  return postPackage;
};
