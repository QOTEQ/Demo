async ({ order, paymentForm }) => {
  const { amount, transaction } = paymentForm;
  const payment = {
    orderId: order.orderId,
    amount,
    transaction,
  };
  const result = await db.pg.insert('Payment', payment);
  console.log({ PAY: result });
  const { paymentId } = result;
  const record = await db.pg.row('Payment', ['*'], { paymentId });
  return record;
};
