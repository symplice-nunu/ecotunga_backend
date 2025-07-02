const db = require('../config/db');

// Get all community events
const getAllEvents = async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    
    let query = db('community_events')
      .select(
        'community_events.*',
        'users.name as created_by_name',
        db.raw('(SELECT COUNT(*) FROM event_participants WHERE event_participants.event_id = community_events.id AND event_participants.status = "registered") as current_participants')
      )
      .leftJoin('users', 'community_events.created_by', 'users.id')
      .where('community_events.is_active', true);

    // Filter by category
    if (category && category !== 'all') {
      query = query.where('community_events.category', category);
    }

    // Filter by featured
    if (featured === 'true') {
      query = query.where('community_events.featured', true);
    }

    // Search functionality
    if (search) {
      query = query.where(function() {
        this.where('community_events.title', 'like', `%${search}%`)
          .orWhere('community_events.description', 'like', `%${search}%`)
          .orWhere('community_events.location', 'like', `%${search}%`);
      });
    }

    const events = await query.orderBy('community_events.event_date', 'asc');
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching community events:', error);
    res.status(500).json({ message: 'Error fetching community events' });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  const { eventId } = req.params;
  
  try {
    const event = await db('community_events')
      .select(
        'community_events.*',
        'users.name as created_by_name',
        db.raw('(SELECT COUNT(*) FROM event_participants WHERE event_participants.event_id = community_events.id AND event_participants.status = "registered") as current_participants')
      )
      .leftJoin('users', 'community_events.created_by', 'users.id')
      .where('community_events.id', eventId)
      .where('community_events.is_active', true)
      .first();
      
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event' });
  }
};

// Create new event
const createEvent = async (req, res) => {
  const {
    title,
    description,
    event_date,
    event_time,
    location,
    category,
    max_participants,
    organizer,
    image_url,
    featured
  } = req.body;

  const userId = req.user.id;

  try {
    // Validate required fields
    if (!title || !description || !event_date || !event_time || !location || !organizer) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [eventId] = await db('community_events')
      .insert({
        title,
        description,
        event_date,
        event_time,
        location,
        category: category || 'other',
        max_participants: max_participants || 50,
        organizer,
        image_url,
        featured: featured || false,
        created_by: userId
      });

    // Fetch the created event
    const event = await db('community_events').where({ id: eventId }).first();

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

// Update event
const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const {
    title,
    description,
    event_date,
    event_time,
    location,
    category,
    max_participants,
    organizer,
    image_url,
    featured,
    is_active
  } = req.body;

  try {
    // Check if event exists
    const existingEvent = await db('community_events').where({ id: eventId }).first();
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update the event
    await db('community_events')
      .where({ id: eventId })
      .update({
        title: title || existingEvent.title,
        description: description || existingEvent.description,
        event_date: event_date || existingEvent.event_date,
        event_time: event_time || existingEvent.event_time,
        location: location || existingEvent.location,
        category: category || existingEvent.category,
        max_participants: max_participants || existingEvent.max_participants,
        organizer: organizer || existingEvent.organizer,
        image_url: image_url || existingEvent.image_url,
        featured: featured !== undefined ? featured : existingEvent.featured,
        is_active: is_active !== undefined ? is_active : existingEvent.is_active,
        updated_at: db.fn.now()
      });

    // Fetch the updated event
    const updatedEvent = await db('community_events').where({ id: eventId }).first();

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error.message, error.stack);
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  
  try {
    // Check if event exists
    const event = await db('community_events').where({ id: eventId }).first();
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Soft delete by setting is_active to false
    await db('community_events')
      .where({ id: eventId })
      .update({ is_active: false, updated_at: db.fn.now() });
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
};

// Join event
const joinEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
    // Check if event exists and is active
    const event = await db('community_events')
      .where({ id: eventId, is_active: true })
      .first();
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found or inactive' });
    }

    // Check if event is full
    const participantCount = await db('event_participants')
      .where({ event_id: eventId, status: 'registered' })
      .count('* as count')
      .first();

    if (parseInt(participantCount.count) >= event.max_participants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Check if user is already registered
    const existingParticipant = await db('event_participants')
      .where({ event_id: eventId, user_id: userId })
      .first();

    if (existingParticipant) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Register user for event
    await db('event_participants').insert({
      event_id: eventId,
      user_id: userId,
      status: 'registered'
    });

    res.json({ message: 'Successfully joined event' });
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ message: 'Error joining event' });
  }
};

// Leave event
const leaveEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
    // Check if user is registered for the event
    const participant = await db('event_participants')
      .where({ event_id: eventId, user_id: userId })
      .first();

    if (!participant) {
      return res.status(404).json({ message: 'Not registered for this event' });
    }

    // Remove user from event
    await db('event_participants')
      .where({ event_id: eventId, user_id: userId })
      .del();

    res.json({ message: 'Successfully left event' });
  } catch (error) {
    console.error('Error leaving event:', error);
    res.status(500).json({ message: 'Error leaving event' });
  }
};

// Get user's joined events
const getUserEvents = async (req, res) => {
  const userId = req.user.id;

  try {
    const events = await db('event_participants')
      .select(
        'community_events.*',
        'event_participants.status as participation_status',
        'event_participants.registered_at',
        'users.name as created_by_name'
      )
      .join('community_events', 'event_participants.event_id', 'community_events.id')
      .leftJoin('users', 'community_events.created_by', 'users.id')
      .where('event_participants.user_id', userId)
      .where('community_events.is_active', true)
      .orderBy('community_events.event_date', 'asc');

    res.json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ message: 'Error fetching user events' });
  }
};

// Count events happening tomorrow
const getTomorrowEventsCount = async (req, res) => {
  try {
    // Get tomorrow's date in YYYY-MM-DD format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const result = await db('community_events')
      .where('event_date', tomorrowDate)
      .where('is_active', true)
      .count('* as count')
      .first();

    const count = parseInt(result.count);

    res.json({
      count,
      tomorrow_date: tomorrowDate,
      message: `Found ${count} event(s) scheduled for tomorrow`
    });
  } catch (error) {
    console.error('Error counting tomorrow events:', error);
    res.status(500).json({ message: 'Error counting tomorrow events' });
  }
};

// Get events happening tomorrow
const getTomorrowEvents = async (req, res) => {
  try {
    // Get tomorrow's date in YYYY-MM-DD format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const events = await db('community_events')
      .select(
        'community_events.*',
        'users.name as created_by_name',
        db.raw('(SELECT COUNT(*) FROM event_participants WHERE event_participants.event_id = community_events.id AND event_participants.status = "registered") as current_participants')
      )
      .leftJoin('users', 'community_events.created_by', 'users.id')
      .where('community_events.event_date', tomorrowDate)
      .where('community_events.is_active', true)
      .orderBy('community_events.event_time', 'asc');

    res.json(events);
  } catch (error) {
    console.error('Error fetching tomorrow events:', error);
    res.status(500).json({ message: 'Error fetching tomorrow events' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getUserEvents,
  getTomorrowEventsCount,
  getTomorrowEvents
}; 