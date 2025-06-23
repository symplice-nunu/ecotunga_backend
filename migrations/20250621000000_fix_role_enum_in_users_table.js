/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.enu('role', ['user', 'waste_collector', 'recycling_center']).notNullable().defaultTo('user').alter();
  });
};

exports.down = function(knex) {
  // You can revert to the previous state if needed, or just drop and recreate as before
  return knex.schema.alterTable('users', (table) => {
    table.string('role').notNullable().defaultTo('user').alter();
  });
}; 