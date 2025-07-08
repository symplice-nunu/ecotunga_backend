/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // First, let's get some existing user IDs and company IDs
  const users = await knex('users').select('id', 'role').limit(10);
  const companies = await knex('companies').select('id').limit(5);
  
  if (users.length === 0) {
    console.log('No users found. Please run user seeds first.');
    return;
  }
  
  if (companies.length === 0) {
    console.log('No companies found. Please run company seeds first.');
    return;
  }

  // Clear existing waste collection data for clean testing
  await knex('waste_collection').del();
  console.log('Cleared existing waste collection data');

  // Create realistic test data for the last 7 months with clear patterns
  const testData = [];
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
  
  // Define realistic collection patterns for each month
  // This will create a clear trend that the graph can visualize
  const monthlyPatterns = [
    { month: 10, year: 2024, name: 'Oct 2024', collections: 12, trend: 'starting' },
    { month: 11, year: 2024, name: 'Nov 2024', collections: 18, trend: 'increasing' },
    { month: 12, year: 2024, name: 'Dec 2024', collections: 25, trend: 'peak' },
    { month: 1, year: 2025, name: 'Jan 2025', collections: 22, trend: 'stable' },
    { month: 2, year: 2025, name: 'Feb 2025', collections: 28, trend: 'growing' },
    { month: 3, year: 2025, name: 'Mar 2025', collections: 32, trend: 'peak' },
    { month: 4, year: 2025, name: 'Apr 2025', collections: 35, trend: 'best' }
  ];

  // Status distribution for realistic patterns
  const getStatusDistribution = (total, monthIndex) => {
    const completed = Math.floor(total * 0.7); // 70% completed
    const pending = Math.floor(total * 0.2);   // 20% pending
    const denied = total - completed - pending; // 10% denied
    
    return { completed, pending, denied };
  };

  monthlyPatterns.forEach((monthData, monthIndex) => {
    const totalCollections = monthData.collections;
    const statusDist = getStatusDistribution(totalCollections, monthIndex);
    
    // Create collections for this month
    let collectionCount = 0;
    
    // Add completed collections
    for (let i = 0; i < statusDist.completed; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const day = Math.floor(Math.random() * 28) + 1;
      const pickupDate = new Date(monthData.year, monthData.month - 1, day);
      
      testData.push({
        user_id: user.id,
        name: `Customer ${monthIndex + 1}-${i + 1}`,
        last_name: `Smith ${monthIndex + 1}-${i + 1}`,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        email: `customer${monthIndex + 1}${i + 1}@example.com`,
        phone_number: `+2507${Math.floor(Math.random() * 90000000) + 10000000}`,
        ubudehe_category: `Category ${Math.floor(Math.random() * 4) + 1}`,
        house_number: `${Math.floor(Math.random() * 100) + 1}`,
        district: ['Kigali', 'Gasabo', 'Kicukiro', 'Nyarugenge'][Math.floor(Math.random() * 4)],
        sector: ['Nyamirambo', 'Kimironko', 'Remera', 'Gikondo', 'Kacyiru'][Math.floor(Math.random() * 5)],
        cell: `Cell ${Math.floor(Math.random() * 10) + 1}`,
        village: `Village ${Math.floor(Math.random() * 10) + 1}`,
        street: `${Math.floor(Math.random() * 100) + 1} Street`,
        company_id: company.id,
        pickup_date: pickupDate.toISOString().split('T')[0],
        time_slot: timeSlots[Math.floor(Math.random() * timeSlots.length)],
        status: 'completed',
        notes: `Completed collection for ${monthData.name}`,
        admin_notes: null,
        status_updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
      collectionCount++;
    }
    
    // Add pending collections
    for (let i = 0; i < statusDist.pending; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const day = Math.floor(Math.random() * 28) + 1;
      const pickupDate = new Date(monthData.year, monthData.month - 1, day);
      
      testData.push({
        user_id: user.id,
        name: `Customer ${monthIndex + 1}-${collectionCount + i + 1}`,
        last_name: `Johnson ${monthIndex + 1}-${collectionCount + i + 1}`,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        email: `customer${monthIndex + 1}${collectionCount + i + 1}@example.com`,
        phone_number: `+2507${Math.floor(Math.random() * 90000000) + 10000000}`,
        ubudehe_category: `Category ${Math.floor(Math.random() * 4) + 1}`,
        house_number: `${Math.floor(Math.random() * 100) + 1}`,
        district: ['Kigali', 'Gasabo', 'Kicukiro', 'Nyarugenge'][Math.floor(Math.random() * 4)],
        sector: ['Nyamirambo', 'Kimironko', 'Remera', 'Gikondo', 'Kacyiru'][Math.floor(Math.random() * 5)],
        cell: `Cell ${Math.floor(Math.random() * 10) + 1}`,
        village: `Village ${Math.floor(Math.random() * 10) + 1}`,
        street: `${Math.floor(Math.random() * 100) + 1} Street`,
        company_id: company.id,
        pickup_date: pickupDate.toISOString().split('T')[0],
        time_slot: timeSlots[Math.floor(Math.random() * timeSlots.length)],
        status: 'pending',
        notes: `Pending collection for ${monthData.name}`,
        admin_notes: null,
        status_updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
      collectionCount++;
    }
    
    // Add denied collections
    for (let i = 0; i < statusDist.denied; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const day = Math.floor(Math.random() * 28) + 1;
      const pickupDate = new Date(monthData.year, monthData.month - 1, day);
      
      testData.push({
        user_id: user.id,
        name: `Customer ${monthIndex + 1}-${collectionCount + i + 1}`,
        last_name: `Williams ${monthIndex + 1}-${collectionCount + i + 1}`,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        email: `customer${monthIndex + 1}${collectionCount + i + 1}@example.com`,
        phone_number: `+2507${Math.floor(Math.random() * 90000000) + 10000000}`,
        ubudehe_category: `Category ${Math.floor(Math.random() * 4) + 1}`,
        house_number: `${Math.floor(Math.random() * 100) + 1}`,
        district: ['Kigali', 'Gasabo', 'Kicukiro', 'Nyarugenge'][Math.floor(Math.random() * 4)],
        sector: ['Nyamirambo', 'Kimironko', 'Remera', 'Gikondo', 'Kacyiru'][Math.floor(Math.random() * 5)],
        cell: `Cell ${Math.floor(Math.random() * 10) + 1}`,
        village: `Village ${Math.floor(Math.random() * 10) + 1}`,
        street: `${Math.floor(Math.random() * 100) + 1} Street`,
        company_id: company.id,
        pickup_date: pickupDate.toISOString().split('T')[0],
        time_slot: timeSlots[Math.floor(Math.random() * timeSlots.length)],
        status: 'denied',
        notes: `Denied collection for ${monthData.name}`,
        admin_notes: 'Insufficient waste volume or scheduling conflict',
        status_updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
    }
  });

  // Insert the test data
  await knex('waste_collection').insert(testData);
  
  console.log('🎯 Graph Test Data Inserted Successfully!');
  console.log(`📊 Total collections created: ${testData.length}`);
  console.log('📈 Monthly collection pattern:');
  monthlyPatterns.forEach(pattern => {
    console.log(`   ${pattern.name}: ${pattern.collections} collections (${pattern.trend})`);
  });
  console.log('');
  console.log('📋 Data Summary:');
  console.log('   - 7 months of realistic data (Oct 2024 - Apr 2025)');
  console.log('   - Clear growth trend: 12 → 18 → 25 → 22 → 28 → 32 → 35');
  console.log('   - Status distribution: ~70% completed, ~20% pending, ~10% denied');
  console.log('   - Perfect for testing the waste collector performance graph');
  console.log('');
  console.log('🚀 You can now test the graph with this realistic data!');
}; 