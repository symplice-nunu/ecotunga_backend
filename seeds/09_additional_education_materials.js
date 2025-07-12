/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Get a user ID for created_by field
  const users = await knex('users').select('id').limit(1);
  const userId = users.length > 0 ? users[0].id : null;

  // Inserts additional seed entries
  await knex('education_materials').insert([
    {
      title: 'Urban Gardening Techniques',
      description: 'Learn how to grow your own food in small urban spaces using sustainable gardening methods.',
      category: 'lifestyle',
      level: 'intermediate',
      type: 'video',
      duration: '15 min video',
      rating: 4.8,
      author: 'Urban Agriculture Network',
      image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      content_url: 'https://example.com/urban-gardening-video',
      featured: true,
      tags: JSON.stringify(['urban-gardening', 'sustainable-living', 'food-production']),
      created_by: userId
    },
    {
      title: 'Renewable Energy Basics',
      description: 'Introduction to renewable energy sources and their importance in combating climate change.',
      category: 'conservation',
      level: 'beginner',
      type: 'guide',
      duration: '25 min read',
      rating: 4.9,
      author: 'Renewable Energy Institute',
      image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop',
      content_url: 'https://example.com/renewable-energy-guide',
      featured: true,
      tags: JSON.stringify(['renewable-energy', 'climate-change', 'sustainability']),
      created_by: userId
    },
    {
      title: 'Circular Economy Principles',
      description: 'Understanding the circular economy model and how it promotes sustainable resource management.',
      category: 'waste-management',
      level: 'advanced',
      type: 'article',
      duration: '22 min read',
      rating: 4.7,
      author: 'Circular Economy Foundation',
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
      content_url: 'https://example.com/circular-economy-article',
      featured: false,
      tags: JSON.stringify(['circular-economy', 'sustainability', 'resource-management']),
      created_by: userId
    },
    {
      title: 'Green Building Materials',
      description: 'Exploring sustainable building materials and their environmental benefits.',
      category: 'materials',
      level: 'intermediate',
      type: 'video',
      duration: '12 min video',
      rating: 4.5,
      author: 'Green Building Council',
      image_url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=250&fit=crop',
      content_url: 'https://example.com/green-building-materials-video',
      featured: false,
      tags: JSON.stringify(['green-building', 'construction', 'sustainable-materials']),
      created_by: userId
    },
    {
      title: 'Waste-to-Energy Technologies',
      description: 'Advanced technologies that convert waste into energy and their environmental implications.',
      category: 'waste-management',
      level: 'advanced',
      type: 'article',
      duration: '30 min read',
      rating: 4.6,
      author: 'Energy Research Center',
      image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop',
      content_url: 'https://example.com/waste-to-energy-article',
      featured: false,
      tags: JSON.stringify(['waste-to-energy', 'technology', 'energy-production']),
      created_by: userId
    },
    {
      title: 'Sustainable Fashion Guide',
      description: 'How to make eco-friendly fashion choices and reduce the environmental impact of clothing.',
      category: 'lifestyle',
      level: 'beginner',
      type: 'guide',
      duration: '18 min read',
      rating: 4.4,
      author: 'Sustainable Fashion Alliance',
      image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=250&fit=crop',
      content_url: 'https://example.com/sustainable-fashion-guide',
      featured: false,
      tags: JSON.stringify(['sustainable-fashion', 'clothing', 'consumer-choices']),
      created_by: userId
    },
    {
      title: 'Biodiversity Conservation',
      description: 'The importance of biodiversity and practical ways to protect local ecosystems.',
      category: 'conservation',
      level: 'intermediate',
      type: 'video',
      duration: '20 min video',
      rating: 4.8,
      author: 'Biodiversity Conservation Society',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      content_url: 'https://example.com/biodiversity-conservation-video',
      featured: true,
      tags: JSON.stringify(['biodiversity', 'ecosystems', 'conservation']),
      created_by: userId
    },
    {
      title: 'Smart Waste Management Systems',
      description: 'Modern technologies and systems for efficient waste collection and processing.',
      category: 'waste-management',
      level: 'advanced',
      type: 'article',
      duration: '28 min read',
      rating: 4.5,
      author: 'Smart Cities Institute',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop',
      content_url: 'https://example.com/smart-waste-management-article',
      featured: false,
      tags: JSON.stringify(['smart-cities', 'technology', 'waste-management']),
      created_by: userId
    },
    {
      title: 'Eco-Friendly Cleaning Products',
      description: 'How to make and use natural cleaning products that are safe for your family and the environment.',
      category: 'lifestyle',
      level: 'beginner',
      type: 'guide',
      duration: '16 min read',
      rating: 4.6,
      author: 'Natural Living Institute',
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
      content_url: 'https://example.com/eco-friendly-cleaning-guide',
      featured: false,
      tags: JSON.stringify(['natural-cleaning', 'household', 'chemical-free']),
      created_by: userId
    },
    {
      title: 'Carbon Footprint Reduction',
      description: 'Practical strategies to reduce your carbon footprint and contribute to climate change mitigation.',
      category: 'conservation',
      level: 'intermediate',
      type: 'video',
      duration: '14 min video',
      rating: 4.7,
      author: 'Climate Action Network',
      image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop',
      content_url: 'https://example.com/carbon-footprint-video',
      featured: true,
      tags: JSON.stringify(['carbon-footprint', 'climate-change', 'sustainability']),
      created_by: userId
    },
    {
      title: 'Recycled Materials Innovation',
      description: 'Innovative uses of recycled materials in product design and manufacturing.',
      category: 'materials',
      level: 'advanced',
      type: 'article',
      duration: '24 min read',
      rating: 4.4,
      author: 'Innovation Design Lab',
      image_url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=250&fit=crop',
      content_url: 'https://example.com/recycled-materials-innovation-article',
      featured: false,
      tags: JSON.stringify(['recycled-materials', 'innovation', 'product-design']),
      created_by: userId
    },
    {
      title: 'Community Recycling Programs',
      description: 'How to start and manage effective community recycling programs.',
      category: 'recycling',
      level: 'intermediate',
      type: 'guide',
      duration: '19 min read',
      rating: 4.8,
      author: 'Community Development Association',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop',
      content_url: 'https://example.com/community-recycling-guide',
      featured: false,
      tags: JSON.stringify(['community-programs', 'recycling', 'social-impact']),
      created_by: userId
    }
  ]);
}; 