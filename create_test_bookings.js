const db = require('./config/db');

async function createTestBookings() {
  try {
    console.log('Creating test recycling center bookings...\n');
    
    // Get the test company ID
    const company = await db('companies')
      .where('email', 'test.recycling@example.com')
      .first();
    
    if (!company) {
      console.log('❌ Test company not found');
      return;
    }
    
    console.log('✅ Found test company:', company.name);
    
    // Get some test users
    const users = await db('users')
      .where('role', 'user')
      .limit(5)
      .select('id', 'name', 'last_name', 'email');
    
    if (users.length === 0) {
      console.log('❌ No users found to create bookings for');
      return;
    }
    
    console.log(`✅ Found ${users.length} users for bookings`);
    
    // Create test bookings
    const today = new Date();
    const bookings = [];
    
    // Create bookings for the next 7 days
    for (let i = 0; i < 7; i++) {
      const bookingDate = new Date(today);
      bookingDate.setDate(today.getDate() + i);
      const dateStr = bookingDate.toISOString().split('T')[0];
      
      // Create 2-4 bookings per day
      const bookingsPerDay = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < bookingsPerDay; j++) {
        const user = users[j % users.length];
        const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
        const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        
        const wasteTypes = ['plastic', 'paper', 'glass', 'metal', 'electronics'];
        const selectedWasteTypes = wasteTypes
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1);
        
        const booking = {
          user_id: user.id,
          company_id: company.id,
          dropoff_date: dateStr,
          time_slot: timeSlot,
          notes: `Test booking ${i + 1}-${j + 1}`,
          district: 'Kigali',
          sector: ['Nyamirambo', 'Kimironko', 'Remera', 'Kicukiro'][Math.floor(Math.random() * 4)],
          cell: `Cell ${Math.floor(Math.random() * 10) + 1}`,
          street: `Street ${Math.floor(Math.random() * 100) + 1}`,
          waste_type: JSON.stringify(selectedWasteTypes)
        };
        
        bookings.push(booking);
      }
    }
    
    // Insert bookings
    const insertedBookings = await db('recycling_center_bookings').insert(bookings);
    
    console.log(`✅ Created ${insertedBookings.length} test bookings`);
    console.log('\nTest bookings created for:');
    console.log('- Next 7 days');
    console.log('- 2-4 bookings per day');
    console.log('- Various time slots');
    console.log('- Different waste types');
    console.log('- Different statuses (pending, completed, cancelled)');
    console.log('- Different locations in Kigali');
    
  } catch (error) {
    console.error('Error creating test bookings:', error);
  } finally {
    process.exit(0);
  }
}

createTestBookings(); 