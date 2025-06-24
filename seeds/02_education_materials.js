/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('education_materials').del();

  // Get a user ID for created_by field
  const users = await knex('users').select('id').limit(1);
  const userId = users.length > 0 ? users[0].id : null;

  // Inserts seed entries
  await knex('education_materials').insert([
    {
      title: 'Waste Segregation Guide',
      description: 'Learn the basics of proper waste segregation and how to separate different types of waste for effective recycling.',
      category: 'waste-management',
      level: 'beginner',
      type: 'guide',
      duration: '15 min read',
      rating: 4.8,
      author: 'EcoTunga Team',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop',
      content_url: 'https://example.com/waste-segregation-guide',
      featured: true,
      tags: JSON.stringify(['recycling', 'waste-segregation', 'beginner']),
      created_by: userId
    },
    {
      title: 'Composting at Home',
      description: 'Step-by-step guide to creating your own compost from kitchen waste and garden materials.',
      category: 'composting',
      level: 'intermediate',
      type: 'video',
      duration: '8 min video',
      rating: 4.6,
      author: 'Green Living Institute',
      image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      content_url: 'https://example.com/composting-video',
      featured: false,
      tags: JSON.stringify(['composting', 'organic-waste', 'home-gardening']),
      created_by: userId
    },
    {
      title: 'Plastic Recycling Process',
      description: 'Understanding how plastic waste is processed and transformed into new products.',
      category: 'recycling',
      level: 'advanced',
      type: 'article',
      duration: '12 min read',
      rating: 4.9,
      author: 'Environmental Science Center',
      image_url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=250&fit=crop',
      content_url: 'https://example.com/plastic-recycling-article',
      featured: true,
      tags: JSON.stringify(['plastic', 'recycling-process', 'advanced']),
      created_by: userId
    },
    {
      title: 'Zero Waste Lifestyle',
      description: 'Practical tips and strategies for reducing waste in your daily life and moving towards a zero-waste lifestyle.',
      category: 'lifestyle',
      level: 'beginner',
      type: 'guide',
      duration: '20 min read',
      rating: 4.7,
      author: 'Zero Waste Movement',
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
      content_url: 'https://example.com/zero-waste-guide',
      featured: false,
      tags: JSON.stringify(['zero-waste', 'lifestyle', 'sustainability']),
      created_by: userId
    },
    {
      title: 'Electronic Waste Management',
      description: 'Proper disposal and recycling of electronic devices to prevent environmental contamination.',
      category: 'e-waste',
      level: 'intermediate',
      type: 'video',
      duration: '10 min video',
      rating: 4.5,
      author: 'Tech Recycling Solutions',
      image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop',
      content_url: 'https://example.com/e-waste-video',
      featured: false,
      tags: JSON.stringify(['e-waste', 'electronics', 'toxic-materials']),
      created_by: userId
    },
    {
      title: 'Sustainable Packaging Solutions',
      description: 'Exploring eco-friendly packaging alternatives and their environmental impact.',
      category: 'packaging',
      level: 'advanced',
      type: 'article',
      duration: '18 min read',
      rating: 4.4,
      author: 'Sustainable Materials Lab',
      image_url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=250&fit=crop',
      content_url: 'https://example.com/sustainable-packaging-article',
      featured: false,
      tags: JSON.stringify(['packaging', 'sustainable-materials', 'business']),
      created_by: userId
    },
    {
      title: 'Water Conservation Methods',
      description: 'Simple and effective ways to conserve water in your home and community.',
      category: 'conservation',
      level: 'beginner',
      type: 'guide',
      duration: '14 min read',
      rating: 4.6,
      author: 'Water Conservation Society',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      content_url: 'https://example.com/water-conservation-guide',
      featured: false,
      tags: JSON.stringify(['water-conservation', 'sustainability', 'home']),
      created_by: userId
    },
    {
      title: 'Biodegradable Materials Guide',
      description: 'Understanding biodegradable materials and their role in reducing environmental pollution.',
      category: 'materials',
      level: 'intermediate',
      type: 'video',
      duration: '11 min video',
      rating: 4.3,
      author: 'Biodegradable Research Institute',
      image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      content_url: 'https://example.com/biodegradable-materials-video',
      featured: false,
      tags: JSON.stringify(['biodegradable', 'materials-science', 'environment']),
      created_by: userId
    }
  ]);
}; 