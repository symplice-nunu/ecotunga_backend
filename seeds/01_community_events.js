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

  // Inserts seed entries
  await knex('community_events').insert([
    {
      title: 'Umuganda Community Cleanup',
      description: 'Join us for our monthly community cleanup event. Help keep our neighborhood clean and beautiful.',
      event_date: '2024-02-15',
      event_time: '08:00:00',
      location: 'Kigali City Center',
      category: 'cleanup',
      max_participants: 50,
      organizer: 'Kigali City Council',
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
      featured: true,
      created_by: userId
    },
    {
      title: 'Youth Environmental Workshop',
      description: 'Educational workshop for young people about environmental conservation and sustainable practices.',
      event_date: '2024-02-20',
      event_time: '14:00:00',
      location: 'Youth Center, Nyarugenge',
      category: 'education',
      max_participants: 30,
      organizer: 'Green Youth Initiative',
      image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop',
      featured: false,
      created_by: userId
    },
    {
      title: 'Tree Planting Day',
      description: 'Help us plant 1000 trees in our community. Bring your family and friends for this meaningful event.',
      event_date: '2024-02-25',
      event_time: '09:00:00',
      location: 'Kacyiru Park',
      category: 'planting',
      max_participants: 100,
      organizer: 'Rwanda Forestry Authority',
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
      featured: true,
      created_by: userId
    },
    {
      title: 'Recycling Awareness Campaign',
      description: 'Learn about proper waste segregation and recycling practices. Interactive demonstrations included.',
      event_date: '2024-02-28',
      event_time: '10:00:00',
      location: 'Kimironko Market',
      category: 'education',
      max_participants: 40,
      organizer: 'EcoTunga Team',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop',
      featured: false,
      created_by: userId
    },
    {
      title: 'Beach Cleanup Initiative',
      description: 'Join us for a beach cleanup at Lake Kivu. Help preserve our beautiful lake environment.',
      event_date: '2024-03-05',
      event_time: '07:00:00',
      location: 'Lake Kivu Beach',
      category: 'cleanup',
      max_participants: 80,
      organizer: 'Lake Conservation Society',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      featured: false,
      created_by: userId
    }
  ]);
}; 