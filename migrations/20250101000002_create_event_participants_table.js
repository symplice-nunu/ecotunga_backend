/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('event_participants', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('event_id').references('id').inTable('community_events').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('status', ['registered', 'attended', 'cancelled']).defaultTo('registered');
    table.timestamp('registered_at').defaultTo(knex.fn.now());
    table.timestamp('attended_at');
    table.text('notes');
    table.timestamps(true, true); // created_at and updated_at
    
    // Ensure a user can only register once per event
    table.unique(['event_id', 'user_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('event_participants');
}; 