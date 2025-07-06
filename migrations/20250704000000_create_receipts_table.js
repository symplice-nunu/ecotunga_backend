/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('receipts', function(table) {
    table.increments('id').primary();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('waste_collection_id').unsigned().references('id').inTable('waste_collection').onDelete('CASCADE');
    table.string('booking_id').notNullable();
    table.string('customer_name').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.string('company').notNullable();
    table.date('pickup_date').notNullable();
    table.string('time_slot').notNullable();
    table.string('location').notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.string('payment_method').notNullable();
    table.string('payment_status').notNullable();
    table.string('transaction_date').notNullable();
    table.json('receipt_data'); // Store the complete receipt data as JSON
    table.timestamps(true, true); // created_at and updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('receipts');
}; 