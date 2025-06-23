/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('companies', (table) => {
    table.enum('type', ['waste_collector', 'recycling_center']).defaultTo('recycling_center').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('companies', (table) => {
    table.dropColumn('type');
  });
}; 