/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('recycling_center_bookings', (table) => {
    table.json('waste_types').comment('Array of waste types being dropped off at recycling center');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('recycling_center_bookings', (table) => {
    table.dropColumn('waste_types');
  });
}; 