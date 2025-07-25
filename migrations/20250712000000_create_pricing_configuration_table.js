/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('pricing_configuration', (table) => {
    table.increments('id').primary();
    table.string('ubudehe_category').notNullable().unique();
    table.decimal('amount', 10, 2).notNullable();
    table.text('description').nullable();
    table.boolean('is_active').defaultTo(true);
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.uuid('updated_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('pricing_configuration');
}; 