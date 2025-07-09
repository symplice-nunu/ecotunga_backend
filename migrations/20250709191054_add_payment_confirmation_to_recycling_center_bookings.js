/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('recycling_center_bookings', function(table) {
    table.boolean('payment_confirmed').defaultTo(false);
    table.timestamp('payment_confirmed_at').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('recycling_center_bookings', function(table) {
    table.dropColumn('payment_confirmed');
    table.dropColumn('payment_confirmed_at');
  });
};
