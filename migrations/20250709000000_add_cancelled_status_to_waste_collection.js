exports.up = function(knex) {
  return knex.raw(`
    ALTER TABLE waste_collection 
    MODIFY COLUMN status ENUM('pending', 'approved', 'denied', 'completed', 'cancelled') 
    DEFAULT 'pending'
  `);
};

exports.down = function(knex) {
  return knex.raw(`
    ALTER TABLE waste_collection 
    MODIFY COLUMN status ENUM('pending', 'approved', 'denied') 
    DEFAULT 'pending'
  `);
}; 