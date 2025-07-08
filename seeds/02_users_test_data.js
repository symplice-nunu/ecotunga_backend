/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Check if users already exist
  const existingUsers = await knex('users').select('id').limit(1);
  
  if (existingUsers.length > 0) {
    console.log('Users already exist, skipping user seed');
    return;
  }

  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Format dates for MySQL
  const now = new Date();
  const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

  const users = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      role: 'user',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword,
      role: 'user',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Waste Collector Test',
      email: 'waste.collector@example.com',
      password: hashedPassword,
      role: 'waste_collector',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Another Collector',
      email: 'collector2@example.com',
      password: hashedPassword,
      role: 'waste_collector',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      name: 'Recycling Center Owner',
      email: 'recycling.center@example.com',
      password: hashedPassword,
      role: 'recycling_center',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      name: 'Mawef User',
      email: 'mawef@mailinator.com',
      password: hashedPassword,
      role: 'user',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    }
  ];

  await knex('users').insert(users);
  console.log('Inserted 6 test users including waste collectors and recycling center');
  console.log('Waste collector email: waste.collector@example.com');
  console.log('Recycling center email: recycling.center@example.com');
  console.log('Password for all users: password123');
}; 