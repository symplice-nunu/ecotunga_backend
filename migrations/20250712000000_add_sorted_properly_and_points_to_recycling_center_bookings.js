exports.up = function(knex) {
  return knex.schema.table('recycling_center_bookings', function(table) {
    table.boolean('sorted_properly').defaultTo(false);
    table.integer('points').defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.table('recycling_center_bookings', function(table) {
    table.dropColumn('sorted_properly');
    table.dropColumn('points');
  });
}; 