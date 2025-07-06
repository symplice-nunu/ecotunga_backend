exports.up = function(knex) {
    return knex.schema.table('companies', function(table) {
        table.string('website');
    });
};

exports.down = function(knex) {
    return knex.schema.table('companies', function(table) {
        table.dropColumn('website');
    });
}; 