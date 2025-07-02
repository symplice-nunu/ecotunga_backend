/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('recycling_center_bookings', function(table) {
    table.string('user_id', 255).notNullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('recycling_center_bookings', function(table) {
    table.integer('user_id').unsigned().notNullable().alter();
  });
};
