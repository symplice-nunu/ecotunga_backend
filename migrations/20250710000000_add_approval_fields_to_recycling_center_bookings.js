/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('recycling_center_bookings', function(table) {
    // Add approval-related fields
    table.string('status').defaultTo('pending');
    table.decimal('price', 10, 2).nullable();
    table.text('approval_notes').nullable();
    table.timestamp('approved_at').nullable();
    table.string('approved_by').nullable();
    table.timestamp('confirmed_at').nullable();
    table.boolean('price_confirmed').defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('recycling_center_bookings', function(table) {
    table.dropColumn('status');
    table.dropColumn('price');
    table.dropColumn('approval_notes');
    table.dropColumn('approved_at');
    table.dropColumn('approved_by');
    table.dropColumn('confirmed_at');
    table.dropColumn('price_confirmed');
  });
}; 