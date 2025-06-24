/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('bookmarked_materials', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('material_id').references('id').inTable('education_materials').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('bookmarked_at').defaultTo(knex.fn.now());
    table.timestamps(true, true); // created_at and updated_at
    
    // Ensure a user can only bookmark a material once
    table.unique(['material_id', 'user_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('bookmarked_materials');
}; 