exports.up = function(knex) {
  return knex.schema.alterTable('recycling_center_bookings', function(table) {
    table.dropColumn('waste_types');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('recycling_center_bookings', function(table) {
    table.json('waste_types').comment('Array of waste types being dropped off at recycling center');
  });
}; 