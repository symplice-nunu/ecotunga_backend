/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('education_materials', (table) => {
    table.string('youtube_url'); // Add YouTube URL field
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('education_materials', (table) => {
    table.dropColumn('youtube_url');
  });
};
