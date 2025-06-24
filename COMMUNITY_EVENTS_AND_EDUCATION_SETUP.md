# Community Events and Education Materials Setup Guide

This guide explains how to set up and use the new Community Events and Education Materials features in the EcoTunga application.

## Database Setup

### 1. Run Migrations

First, run the database migrations to create the necessary tables:

```bash
cd ecotunga_backend
npm run migrate
```

This will create the following tables:
- `community_events` - Stores community event information
- `education_materials` - Stores educational content
- `event_participants` - Tracks user participation in events
- `bookmarked_materials` - Tracks user bookmarks for education materials

### 2. Seed the Database

Populate the database with sample data:

```bash
npm run seed
```

This will add sample community events and education materials to get you started.

## API Endpoints

### Community Events

#### Public Endpoints (No Authentication Required)
- `GET /api/community-events` - Get all events with optional filters
- `GET /api/community-events/:eventId` - Get specific event details

#### Protected Endpoints (Authentication Required)
- `POST /api/community-events` - Create new event (Admin only)
- `PUT /api/community-events/:eventId` - Update event (Admin only)
- `DELETE /api/community-events/:eventId` - Delete event (Admin only)
- `POST /api/community-events/:eventId/join` - Join an event
- `DELETE /api/community-events/:eventId/leave` - Leave an event
- `GET /api/community-events/user/events` - Get user's joined events

### Education Materials

#### Public Endpoints (No Authentication Required)
- `GET /api/education-materials` - Get all materials with optional filters
- `GET /api/education-materials/:materialId` - Get specific material details

#### Protected Endpoints (Authentication Required)
- `POST /api/education-materials` - Create new material (Admin only)
- `PUT /api/education-materials/:materialId` - Update material (Admin only)
- `DELETE /api/education-materials/:materialId` - Delete material (Admin only)
- `POST /api/education-materials/:materialId/bookmark` - Bookmark material
- `DELETE /api/education-materials/:materialId/bookmark` - Remove bookmark
- `GET /api/education-materials/user/bookmarks` - Get user's bookmarked materials
- `POST /api/education-materials/:materialId/rate` - Rate material

## Query Parameters

### Community Events Filters
- `category` - Filter by event category (cleanup, education, planting, other)
- `featured` - Filter featured events only (true/false)
- `search` - Search in title, description, and location

### Education Materials Filters
- `category` - Filter by material category
- `level` - Filter by difficulty level (beginner, intermediate, advanced)
- `type` - Filter by content type (guide, video, article)
- `featured` - Filter featured materials only (true/false)
- `search` - Search in title, description, author, and tags

## Database Schema

### Community Events Table
```sql
CREATE TABLE community_events (
  id UUID PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location VARCHAR NOT NULL,
  category ENUM('cleanup', 'education', 'planting', 'other') DEFAULT 'other',
  max_participants INT DEFAULT 50,
  current_participants INT DEFAULT 0,
  organizer VARCHAR NOT NULL,
  image_url VARCHAR,
  featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Education Materials Table
```sql
CREATE TABLE education_materials (
  id UUID PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  category ENUM('waste-management', 'recycling', 'composting', 'lifestyle', 'e-waste', 'packaging', 'conservation', 'materials') NOT NULL,
  level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  type ENUM('guide', 'video', 'article') NOT NULL,
  duration VARCHAR NOT NULL,
  views INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  author VARCHAR NOT NULL,
  image_url VARCHAR,
  content_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  tags JSON,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Event Participants Table
```sql
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT (UUID()),
  event_id UUID REFERENCES community_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status ENUM('registered', 'attended', 'cancelled') DEFAULT 'registered',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attended_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);
```

### Bookmarked Materials Table
```sql
CREATE TABLE bookmarked_materials (
  id UUID PRIMARY KEY DEFAULT (UUID()),
  material_id UUID REFERENCES education_materials(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bookmarked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(material_id, user_id)
);
```

## Frontend Integration

The frontend has been updated with:

1. **Community Events Page** (`/community`)
   - Displays all community events
   - Search and filter functionality
   - Join/leave event functionality
   - Featured events section

2. **Education Materials Page** (`/education`)
   - Displays all education materials
   - Advanced filtering by category, level, and type
   - Bookmark functionality
   - Featured materials section

3. **API Services**
   - `communityEventApi.js` - Handles all community event API calls
   - `educationMaterialApi.js` - Handles all education material API calls

## Features

### Community Events
- ✅ Create, read, update, delete events
- ✅ Join and leave events
- ✅ Track participant counts
- ✅ Featured events
- ✅ Search and filtering
- ✅ Event categories (cleanup, education, planting)
- ✅ Soft delete functionality

### Education Materials
- ✅ Create, read, update, delete materials
- ✅ Bookmark/unbookmark materials
- ✅ Rate materials
- ✅ Track view counts
- ✅ Featured materials
- ✅ Advanced search and filtering
- ✅ Multiple content types (guide, video, article)
- ✅ Difficulty levels (beginner, intermediate, advanced)
- ✅ Tags support
- ✅ Soft delete functionality

## Usage Examples

### Creating a Community Event
```javascript
const eventData = {
  title: "Beach Cleanup",
  description: "Join us for a beach cleanup event",
  event_date: "2024-03-15",
  event_time: "09:00:00",
  location: "Lake Kivu Beach",
  category: "cleanup",
  max_participants: 50,
  organizer: "EcoTunga Team",
  image_url: "https://example.com/image.jpg",
  featured: false
};

const response = await communityEventApi.createEvent(eventData);
```

### Creating an Education Material
```javascript
const materialData = {
  title: "Waste Segregation Guide",
  description: "Learn about proper waste segregation",
  category: "waste-management",
  level: "beginner",
  type: "guide",
  duration: "15 min read",
  author: "EcoTunga Team",
  image_url: "https://example.com/image.jpg",
  content_url: "https://example.com/content",
  featured: true,
  tags: ["recycling", "waste-segregation", "beginner"]
};

const response = await educationMaterialApi.createMaterial(materialData);
```

## Troubleshooting

### Common Issues

1. **Migration Errors**
   - Ensure your database is running
   - Check that the database connection is properly configured
   - Verify that the users table exists before running migrations

2. **API Errors**
   - Check that the server is running
   - Verify authentication tokens are valid
   - Check request payload format

3. **Frontend Issues**
   - Ensure the API base URL is correctly configured
   - Check browser console for errors
   - Verify that all required dependencies are installed

### Support

For additional support or questions, please refer to the main project documentation or contact the development team. 