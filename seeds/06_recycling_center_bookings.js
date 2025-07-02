/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Check if recycling center bookings already exist
  const existingBookings = await knex('recycling_center_bookings').select('id').limit(1);
  
  if (existingBookings.length > 0) {
    console.log('Recycling center bookings already exist, skipping seed');
    return;
  }

  // Get the recycling center company ID
  const recyclingCompany = await knex('companies')
    .where('type', 'recycling_center')
    .first();

  if (!recyclingCompany) {
    console.log('No recycling center company found, skipping seed');
    return;
  }

  // Get some user IDs
  const users = await knex('users')
    .where('role', 'user')
    .select('id')
    .limit(3);

  if (users.length === 0) {
    console.log('No users found, skipping seed');
    return;
  }

  // Format dates for MySQL
  const now = new Date();
  const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

  // Create test bookings for different dates
  const bookings = [
    {
      user_id: users[0].id,
      company_id: recyclingCompany.id,
      dropoff_date: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      time_slot: '09:00 AM - 10:00 AM',
      notes: 'Plastic bottles and paper',
      district: 'Kigali',
      sector: 'Nyamirambo',
      cell: 'Cell 1',
      street: 'KG 123 Street',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    },
    {
      user_id: users[1]?.id || users[0].id,
      company_id: recyclingCompany.id,
      dropoff_date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
      time_slot: '02:00 PM - 03:00 PM',
      notes: 'Glass bottles and aluminum cans',
      district: 'Gasabo',
      sector: 'Kimironko',
      cell: 'Cell 2',
      street: 'KG 456 Street',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    },
    {
      user_id: users[2]?.id || users[0].id,
      company_id: recyclingCompany.id,
      dropoff_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
      time_slot: '11:00 AM - 12:00 PM',
      notes: 'Mixed recyclables',
      district: 'Kicukiro',
      sector: 'Remera',
      cell: 'Cell 3',
      street: 'KG 789 Street',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    }
  ];

  await knex('recycling_center_bookings').insert(bookings);
  console.log('Inserted 3 test recycling center bookings');
};
