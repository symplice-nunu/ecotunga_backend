/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('community_events').del();

  // Get a user ID for created_by field
  const users = await knex('users').select('id').limit(1);
  const userId = users.length > 0 ? users[0].id : null;

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  // Inserts seed entries
  await knex('community_events').insert([
    {
      title: 'Community Cleanup Event',
      description: 'Join us for a community cleanup event to make our neighborhood cleaner and greener.',
      event_date: tomorrowDate,
      event_time: '09:00:00',
      location: 'Central Park, Kigali',
      category: 'cleanup',
      max_participants: 50,
      current_participants: 0,
      organizer: 'EcoTunga Community',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop',
      featured: true,
      is_active: true,
      created_by: userId
    },
    {
      title: 'Environmental Education Workshop',
      description: 'Learn about sustainable practices and environmental conservation.',
      event_date: tomorrowDate,
      event_time: '14:00:00',
      location: 'Community Center, Kigali',
      category: 'education',
      max_participants: 30,
      current_participants: 0,
      organizer: 'Green Education Initiative',
      image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      featured: false,
      is_active: true,
      created_by: userId
    },
    {
      title: 'Tree Planting Day',
      description: 'Help us plant trees to improve air quality and create a greener environment.',
      event_date: tomorrowDate,
      event_time: '10:00:00',
      location: 'City Gardens, Kigali',
      category: 'planting',
      max_participants: 40,
      current_participants: 0,
      organizer: 'Tree Planting Foundation',
      image_url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=250&fit=crop',
      featured: true,
      is_active: true,
      created_by: userId
    }
  ]);
}; 