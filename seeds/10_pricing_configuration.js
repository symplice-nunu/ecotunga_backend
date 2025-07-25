/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Clear existing data
  await knex('pricing_configuration').del();

  // Insert default pricing configuration
  await knex('pricing_configuration').insert([
    {
      ubudehe_category: 'A',
      amount: 1000.00,
      description: 'Category A - Lowest income bracket',
      is_active: true
    },
    {
      ubudehe_category: 'B',
      amount: 1500.00,
      description: 'Category B - Low income bracket',
      is_active: true
    },
    {
      ubudehe_category: 'C',
      amount: 2000.00,
      description: 'Category C - Medium income bracket',
      is_active: true
    },
    {
      ubudehe_category: 'D',
      amount: 4000.00,
      description: 'Category D - High income bracket',
      is_active: true
    }
  ]);
}; 