/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // First, let's get some existing user IDs and company IDs
  const users = await knex('users').select('id', 'role').limit(5);
  const companies = await knex('companies').select('id').limit(3);
  
  if (users.length === 0) {
    console.log('No users found. Please run user seeds first.');
    return;
  }
  
  if (companies.length === 0) {
    console.log('No companies found. Please run company seeds first.');
    return;
  }

  // Create test waste collection data for the last 7 months
  const testData = [];
  const statuses = ['pending', 'approved', 'denied'];
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
  
  // Generate data for the last 7 months (Sept 2024 to April 2025)
  const months = [
    { month: 9, year: 2024, name: 'Sept 2024' },
    { month: 11, year: 2024, name: 'Nov 2024' },
    { month: 12, year: 2024, name: 'Dec 2024' },
    { month: 1, year: 2025, name: 'Jan 2025' },
    { month: 2, year: 2025, name: 'Feb 2025' },
    { month: 3, year: 2025, name: 'March 2025' },
    { month: 4, year: 2025, name: 'April 2025' }
  ];

  months.forEach((monthData, monthIndex) => {
    // Generate 5-15 collections per month
    const collectionsCount = Math.floor(Math.random() * 11) + 5; // 5-15 collections
    
    for (let i = 0; i < collectionsCount; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomCompany = companies[Math.floor(Math.random() * companies.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomTimeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      
      // Create a random date within the month
      const day = Math.floor(Math.random() * 28) + 1; // 1-28 to avoid invalid dates
      const pickupDate = new Date(monthData.year, monthData.month - 1, day);
      
      // Format dates for MySQL
      const now = new Date();
      const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
      
      testData.push({
        user_id: randomUser.id,
        name: `Test User ${monthIndex + 1}-${i + 1}`,
        last_name: `Last ${monthIndex + 1}-${i + 1}`,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        email: `testuser${monthIndex + 1}${i + 1}@example.com`,
        phone_number: `+2507${Math.floor(Math.random() * 90000000) + 10000000}`,
        ubudehe_category: `Category ${Math.floor(Math.random() * 4) + 1}`,
        district: ['Kigali', 'Gasabo', 'Kicukiro'][Math.floor(Math.random() * 3)],
        sector: ['Nyamirambo', 'Kimironko', 'Remera'][Math.floor(Math.random() * 3)],
        cell: `Cell ${Math.floor(Math.random() * 10) + 1}`,
        village: `Village ${Math.floor(Math.random() * 10) + 1}`,
        street: `${Math.floor(Math.random() * 100) + 1} Street`,
        company_id: randomCompany.id,
        pickup_date: pickupDate.toISOString().split('T')[0], // YYYY-MM-DD format
        time_slot: randomTimeSlot,
        status: randomStatus,
        notes: `Test collection ${monthIndex + 1}-${i + 1} for ${monthData.name}`,
        admin_notes: randomStatus === 'denied' ? 'Test rejection reason' : null,
        status_updated_at: mysqlDateTime,
        created_at: mysqlDateTime,
        updated_at: mysqlDateTime
      });
    }
  });

  // Insert the test data
  await knex('waste_collection').insert(testData);
  
  console.log(`Inserted ${testData.length} test waste collection records`);
  console.log('Test data covers the last 7 months with various statuses (pending, approved, denied)');
  console.log('This will help test the waste collector graph functionality');
}; 