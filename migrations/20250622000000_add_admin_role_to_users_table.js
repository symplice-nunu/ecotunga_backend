/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.enu('role', ['user', 'waste_collector', 'recycling_center', 'admin']).notNullable().defaultTo('user').alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.enu('role', ['user', 'waste_collector', 'recycling_center']).notNullable().defaultTo('user').alter();
  });
}; 