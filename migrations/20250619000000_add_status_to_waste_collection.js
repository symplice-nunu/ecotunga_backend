exports.up = function(knex) {
  return knex.schema.table('waste_collection', function(table) {
    table.enum('status', ['pending', 'approved', 'denied']).defaultTo('pending').after('notes');
    table.text('admin_notes').after('status');
    table.timestamp('status_updated_at').after('admin_notes');
  });
};

exports.down = function(knex) {
  return knex.schema.table('waste_collection', function(table) {
    table.dropColumn('status');
    table.dropColumn('admin_notes');
    table.dropColumn('status_updated_at');
  });
}; 