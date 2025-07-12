/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Get a user ID for created_by field
  const users = await knex('users').select('id').limit(1);
  const userId = users.length > 0 ? users[0].id : null;

  // Generate dates for the next 30 days
  const generateDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  };

  // Inserts 10 additional seed entries
  await knex('community_events').insert([
    {
      title: 'Recycling Awareness Campaign',
      description: 'Learn about proper waste segregation and recycling practices. Interactive workshops and demonstrations included.',
      event_date: generateDate(3),
      event_time: '15:00:00',
      location: 'Kigali Convention Center',
      category: 'education',
      max_participants: 75,
      current_participants: 12,
      organizer: 'Rwanda Environmental Agency',
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
      featured: true,
      is_active: true,
      created_by: userId
    },
    {
      title: 'Beach Cleanup Initiative',
      description: 'Join us for a beach cleanup along Lake Kivu. Help preserve our beautiful lake and marine life.',
      event_date: generateDate(5),
      event_time: '08:00:00',
      location: 'Lake Kivu Beach, Rubavu',
      category: 'cleanup',
      max_participants: 100,
      current_participants: 45,
      organizer: 'Lake Conservation Society',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
      featured: false,
      is_active: true,
      created_by: userId
    },
    {
      title: 'Urban Garden Workshop',
      description: 'Learn how to create and maintain urban gardens. Perfect for apartment dwellers and small space gardening.',
      event_date: generateDate(7),
      event_time: '10:30:00',
      location: 'Urban Farm Hub, Kigali',
      category: 'education',
      max_participants: 25,
      current_participants: 18,
      organizer: 'Urban Agriculture Network',
      image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      featured: false,
      is_active: true,
      created_by: userId
    },
    {
      title: 'Mountain Trail Restoration',
      description: 'Help restore hiking trails in the Virunga Mountains. Equipment provided, no experience necessary.',
      event_date: generateDate(10),
      event_time: '07:00:00',
      location: 'Virunga Mountains, Musanze',
      category: 'cleanup',
      max_participants: 60,
      current_participants: 22,
      organizer: 'Mountain Conservation Trust',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      featured: true,
      is_active: true,
      created_by: userId
    },
    {
      title: 'Composting Masterclass',
      description: 'Master the art of composting. Learn different methods and how to use compost in your garden.',
      event_date: generateDate(12),
      event_time: '14:00:00',
      location: 'Green Skills Academy, Kigali',
      category: 'education',
      max_participants: 35,
      current_participants: 28,
      organizer: 'Sustainable Living Institute',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop',
      featured: false,
      is_active: true,
      created_by: userId
    },
    {
      title: 'Community Fruit Tree Planting',
      description: 'Plant fruit trees in community spaces. Help create food security and green spaces for future generations.',
      event_date: generateDate(14),
      event_time: '09:00:00',
      location: 'Community Gardens, Huye',
      category: 'planting',
      max_participants: 80,
      current_participants: 35,
      organizer: 'Community Development Association',
      image_url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=250&fit=crop',
      featured: true,
      is_active: true,
      created_by: userId
    },
    {
      title: 'E-Waste Collection Drive',
      description: 'Properly dispose of electronic waste. Learn about e-waste recycling and environmental impact.',
      event_date: generateDate(16),
      event_time: '11:00:00',
      location: 'Tech Hub, Kigali',
      category: 'cleanup',
      max_participants: 50,
      current_participants: 15,
      organizer: 'E-Waste Management Rwanda',
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
      featured: false,
      is_active: true,
      created_by: userId
    },
    {
      title: 'Sustainable Fashion Workshop',
      description: 'Learn to upcycle old clothes and create sustainable fashion. Reduce textile waste through creativity.',
      event_date: generateDate(18),
      event_time: '13:00:00',
      location: 'Creative Arts Center, Kigali',
      category: 'education',
      max_participants: 30,
      current_participants: 25,
      organizer: 'Fashion Revolution Rwanda',
      image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      featured: false,
      is_active: true,
      created_by: userId
    },
    {
      title: 'Bamboo Forest Restoration',
      description: 'Help restore bamboo forests for sustainable building materials and carbon sequestration.',
      event_date: generateDate(21),
      event_time: '08:30:00',
      location: 'Bamboo Valley, Nyungwe',
      category: 'planting',
      max_participants: 70,
      current_participants: 40,
      organizer: 'Bamboo Conservation Society',
      image_url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=250&fit=crop',
      featured: true,
      is_active: true,
      created_by: userId
    },
    {
      title: 'Water Conservation Workshop',
      description: 'Learn water-saving techniques and rainwater harvesting methods for sustainable water management.',
      event_date: generateDate(25),
      event_time: '16:00:00',
      location: 'Water Resources Center, Kigali',
      category: 'education',
      max_participants: 40,
      current_participants: 20,
      organizer: 'Water Conservation Alliance',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop',
      featured: false,
      is_active: true,
      created_by: userId
    }
  ]);
}; 