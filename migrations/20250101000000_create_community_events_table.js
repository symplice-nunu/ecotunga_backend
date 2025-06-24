/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('community_events', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.date('event_date').notNullable();
    table.time('event_time').notNullable();
    table.string('location').notNullable();
    table.enum('category', ['cleanup', 'education', 'planting', 'other']).defaultTo('other');
    table.integer('max_participants').defaultTo(50);
    table.integer('current_participants').defaultTo(0);
    table.string('organizer').notNullable();
    table.string('image_url');
    table.boolean('featured').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.uuid('created_by').references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true); // created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('community_events');
}; 