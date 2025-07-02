const db = require('./config/db');

async function testTomorrowEventsCount() {
  try {
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    
    console.log('Testing tomorrow events count for date:', tomorrowDate);
    
    // Check if there are any events for tomorrow
    const result = await db('community_events')
      .where('event_date', tomorrowDate)
      .where('is_active', true)
      .count('* as count')
      .first();

    const count = parseInt(result.count);
    console.log('Tomorrow events count:', count);
    
    // List the events
    const events = await db('community_events')
      .where('event_date', tomorrowDate)
      .where('is_active', true)
      .select('title', 'event_date', 'event_time');
    
    console.log('Events for tomorrow:');
    events.forEach(event => {
      console.log(`- ${event.title} at ${event.event_time}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.destroy();
  }
}

testTomorrowEventsCount(); 