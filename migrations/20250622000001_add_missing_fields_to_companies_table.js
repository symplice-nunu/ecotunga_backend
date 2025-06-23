/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('companies', (table) => {
    table.string('ubudehe_category');
    table.string('gender');
    table.string('last_name');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('companies', (table) => {
    table.dropColumn('ubudehe_category');
    table.dropColumn('gender');
    table.dropColumn('last_name');
  });
}; 