async ({ reservation }) => {
  const { reservationId } = reservation;
  await db.pg.update('Reservation', { reservationId }, { active: false });
};
