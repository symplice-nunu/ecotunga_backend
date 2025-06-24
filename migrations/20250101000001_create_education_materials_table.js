/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('education_materials', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.enum('category', ['waste-management', 'recycling', 'composting', 'lifestyle', 'e-waste', 'packaging', 'conservation', 'materials']).notNullable();
    table.enum('level', ['beginner', 'intermediate', 'advanced']).defaultTo('beginner');
    table.enum('type', ['guide', 'video', 'article']).notNullable();
    table.string('duration').notNullable(); // e.g., "15 min read", "8 min video"
    table.integer('views').defaultTo(0);
    table.decimal('rating', 2, 1).defaultTo(0.0); // Rating out of 5.0
    table.string('author').notNullable();
    table.string('image_url');
    table.text('content_url'); // URL to the actual content (video, article, etc.)
    table.boolean('featured').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.json('tags'); // Store tags as JSON array
    table.uuid('created_by').references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true); // created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('education_materials');
}; 