/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('last_name');
    table.string('gender');
    table.string('phone_number');
    table.string('ubudehe_category');
    table.string('district');
    table.string('sector');
    table.string('cell');
    table.string('street');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('last_name');
    table.dropColumn('gender');
    table.dropColumn('phone_number');
    table.dropColumn('ubudehe_category');
    table.dropColumn('district');
    table.dropColumn('sector');
    table.dropColumn('cell');
    table.dropColumn('street');
  });
}; 