({
  async method({ order, balance }) {
    console.log(order, balance);
    const confirmed = true;
    return { confirmed };
  },
});
