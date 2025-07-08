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

  // Get the specific user mawef@mailinator.com
  const mawefUser = await knex('users')
    .where('email', 'mawef@mailinator.com')
    .first();

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

  // Add sample bookings for mawef@mailinator.com if user exists
  if (mawefUser) {
    const mawefBookings = [
      {
        user_id: mawefUser.id,
        company_id: recyclingCompany.id,
        dropoff_date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        time_slot: '10:00 AM - 11:00 AM',
        notes: 'Plastic bottles, paper, and glass containers',
        district: 'Gasabo',
        sector: 'Kimironko',
        cell: 'Kinyinya',
        street: 'KG 123 Avenue',
        waste_type: JSON.stringify(['plastic_bottles', 'paper', 'glass']),
        created_at: mysqlDateTime,
        updated_at: mysqlDateTime
      },
      {
        user_id: mawefUser.id,
        company_id: recyclingCompany.id,
        dropoff_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        time_slot: '03:00 PM - 04:00 PM',
        notes: 'Electronics and batteries for proper disposal',
        district: 'Kicukiro',
        sector: 'Remera',
        cell: 'Gatenga',
        street: 'KG 456 Boulevard',
        waste_type: JSON.stringify(['electronics', 'batteries']),
        created_at: mysqlDateTime,
        updated_at: mysqlDateTime
      },
      {
        user_id: mawefUser.id,
        company_id: recyclingCompany.id,
        dropoff_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago (completed)
        time_slot: '02:00 PM - 03:00 PM',
        notes: 'Completed drop-off of mixed recyclables',
        district: 'Nyarugenge',
        sector: 'Nyamirambo',
        cell: 'Nyamirambo',
        street: 'KG 789 Street',
        waste_type: JSON.stringify(['plastic_bags', 'aluminum', 'steel']),
        created_at: mysqlDateTime,
        updated_at: mysqlDateTime
      },
      {
        user_id: mawefUser.id,
        company_id: recyclingCompany.id,
        dropoff_date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
        time_slot: '09:00 AM - 10:00 AM',
        notes: 'Large quantity of construction materials',
        district: 'Gasabo',
        sector: 'Gisozi',
        cell: 'Gisozi',
        street: 'KG 101 Road',
        waste_type: JSON.stringify(['construction', 'steel', 'other']),
        created_at: mysqlDateTime,
        updated_at: mysqlDateTime
      }
    ];
    
    bookings.push(...mawefBookings);
  }

  await knex('recycling_center_bookings').insert(bookings);
  const totalBookings = bookings.length;
  console.log(`Inserted ${totalBookings} test recycling center bookings`);
  if (mawefUser) {
    console.log(`Added 4 sample bookings for mawef@mailinator.com`);
  }
};
