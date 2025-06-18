exports.up = function(knex) {
    return knex.schema.createTable('companies', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('phone').notNullable();
        table.string('logo');
        table.string('district').notNullable();
        table.string('sector').notNullable();
        table.string('cell').notNullable();
        table.string('village').notNullable();
        table.string('street').notNullable();
        table.decimal('amount_per_month', 10, 2).notNullable();
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('companies');
}; 