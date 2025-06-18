/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('waste_collection', (table) => {
    table.increments('id').primary();
    table.uuid('user_id').notNullable();
    table.string('name');
    table.string('last_name');
    table.string('gender');
    table.string('email');
    table.string('phone_number');
    table.string('ubudehe_category');
    table.string('district');
    table.string('sector');
    table.string('cell');
    table.string('village');
    table.string('street');
    table.integer('company_id').unsigned().references('id').inTable('companies');
    table.date('pickup_date');
    table.string('time_slot');
    table.text('notes');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('waste_collection');
}; 