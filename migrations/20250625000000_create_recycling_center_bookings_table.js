exports.up = function(knex) {
  return knex.schema.createTable('recycling_center_bookings', function(table) {
    table.increments('id').primary();
    table.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('company_id').unsigned().notNullable().references('id').inTable('companies').onDelete('CASCADE');
    table.date('dropoff_date').notNullable();
    table.string('time_slot').notNullable();
    table.text('notes');
    table.string('district').notNullable();
    table.string('sector').notNullable();
    table.string('cell').notNullable();
    table.string('street');
    table.timestamps(true, true); // created_at and updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('recycling_center_bookings');
}; 