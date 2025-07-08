/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
    ALTER TABLE waste_collection 
    MODIFY COLUMN status ENUM('pending', 'approved', 'denied', 'completed') DEFAULT 'pending'
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`
    ALTER TABLE waste_collection 
    MODIFY COLUMN status ENUM('pending', 'approved', 'denied') DEFAULT 'pending'
  `);
}; 