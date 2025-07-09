/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Check if companies already exist
  const existingCompanies = await knex('companies').select('id').limit(1);
  
  if (existingCompanies.length > 0) {
    console.log('Companies already exist, skipping company seed');
    return;
  }

  // Format dates for MySQL
  const now = new Date();
  const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

  const companies = [
    {
      name: 'EcoClean Rwanda',
      email: 'recycling.center@example.com', // Match the recycling center user email
      phone: '+250788123456',
      logo: 'https://example.com/ecoclean-logo.png',
      district: 'Kigali',
      sector: 'Nyamirambo',
      cell: 'Cell 1',
      village: 'Village 1',
      street: 'KG 123 Street',
      amount_per_month: 15000.00,
      user_id: '550e8400-e29b-41d4-a716-446655440006', // Recycling center user
      type: 'recycling_center',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    },
    {
      name: 'GreenWaste Solutions',
      email: 'contact@greenwaste.rw',
      phone: '+250789234567',
      logo: 'https://example.com/greenwaste-logo.png',
      district: 'Gasabo',
      sector: 'Kimironko',
      cell: 'Cell 2',
      village: 'Village 2',
      street: 'KG 456 Street',
      amount_per_month: 18000.00,
      type: 'waste_collector',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    },
    {
      name: 'CleanRwanda Ltd',
      email: 'hello@cleanrwanda.rw',
      phone: '+250790345678',
      logo: 'https://example.com/cleanrwanda-logo.png',
      district: 'Kicukiro',
      sector: 'Remera',
      cell: 'Cell 3',
      village: 'Village 3',
      street: 'KG 789 Street',
      amount_per_month: 12000.00,
      type: 'waste_collector',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    }
  ];

  await knex('companies').insert(companies);
  console.log('Inserted 3 test companies');
}; 