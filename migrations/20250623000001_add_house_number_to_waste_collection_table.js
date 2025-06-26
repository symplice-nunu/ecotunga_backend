/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('waste_collection', (table) => {
    table.string('house_number');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('waste_collection', (table) => {
    table.dropColumn('house_number');
  });
}; 