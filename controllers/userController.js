const db = require('../config/db');
const PDFDocument = require('pdfkit');
const knex = require('../config/db');

const getAllUsers = async (req, res) => {
  try {
    const users = await db('users').select('id', 'name', 'email', 'role', 'created_at');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await db('users')
      .where({ id: userId })
      .select('id', 'name', 'email', 'role', 'created_at')
      .first();
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Check if user exists
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await db('users').where({ id: userId }).del();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, role } = req.body;

  try {
    // Check if user exists
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await db('users').where({ email }).first();
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update the user
    await db('users')
      .where({ id: userId })
      .update({
        name,
        email,
        role: role || user.role,
        updated_at: db.fn.now()
      });

    // Get the updated user
    const updatedUser = await db('users')
      .where({ id: userId })
      .select('id', 'name', 'email', 'role', 'created_at')
      .first();

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.id; // Get user ID from auth middleware
  const {
    email,
    name,
    last_name,
    gender,
    phone_number,
    ubudehe_category,
    house_number,
    district,
    sector,
    cell,
    street,
    role,
    waste_types
  } = req.body;

  // console.log('updateProfile called with data:', req.body);
  // console.log('house_number from request:', house_number);

  try {
    // Check if user exists
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await db('users').where({ email }).first();
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const updateData = {
      email: email || user.email,
      name: name || user.name,
      last_name,
      gender,
      phone_number,
      ubudehe_category,
      house_number,
      district,
      sector,
      cell,
      street,
      role: role || user.role,
      updated_at: db.fn.now()
    };

    // Add waste_types if provided
    if (waste_types !== undefined) {
      updateData.waste_types = JSON.stringify(waste_types);
    }

    // console.log('Update data being sent to database:', updateData);

    // Update the user profile
    await db('users')
      .where({ id: userId })
      .update(updateData);

    // If user is a recycling center and waste_types were updated, also update the company record
    if (user.role === 'recycling_center' && waste_types !== undefined) {
      try {
        await db('companies')
          .where({ email: user.email })
          .update({
            waste_types: JSON.stringify(waste_types),
            updated_at: db.fn.now()
          });
      } catch (companyError) {
        console.error('Error updating company waste types:', companyError);
        // Don't fail the user update if company update fails
      }
    }

    // Get the updated user
    const updatedUser = await db('users')
      .where({ id: userId })
      .select(
        'id', 
        'name', 
        'email', 
        'last_name',
        'gender',
        'phone_number',
        'ubudehe_category',
        'house_number',
        'district',
        'sector',
        'cell',
        'street',
        'role',
        'waste_types',
        'created_at',
        'updated_at'
      )
      .first();

    // console.log('Updated user from database:', updatedUser);
    // console.log('house_number in updated user:', updatedUser.house_number);

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id; // Get user ID from auth middleware

  try {
    const user = await db('users')
      .where({ id: userId })
      .select(
        'id', 
        'name', 
 'email', 
        'last_name',
        'gender',
        'phone_number',
        'ubudehe_category',
        'house_number',
        'district',
        'sector',
        'cell',
        'street',
        'role',
        'waste_types',
        'created_at',
        'updated_at'
      )
      .first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

const generateUsersPDF = async (req, res) => {
  try {
    const users = await knex('users').select('*');
    
    // CSS-like styles
    const styles = {
      colors: {
        primary: '#2563EB',
        secondary: '#1E293B',
        text: {
          primary: '#0F172A',
          secondary: '#334155',
          light: '#94A3B8',
          white: '#FFFFFF'
        },
        background: {
          header: '#2563EB',
          table: {
            header: '#F1F5F9',
            row: {
              even: '#FFFFFF',
              odd: '#F8FAFC'
            }
          },
          footer: '#F1F5F9'
        }
      },
      typography: {
        fontFamily: 'Helvetica',
        sizes: {
          h1: 32,
          h2: 16,
          body: 14,
          small: 10
        }
      },
      spacing: {
        margin: 40,
        padding: 10,
        rowHeight: 30
      },
      layout: {
        headerHeight: 100,
        footerHeight: 40
      }
    };
    
    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: styles.spacing.margin,
      bufferPages: true
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');
    
    // Pipe the PDF to the response
    doc.pipe(res);

    // Add header background
    doc.rect(0, 0, doc.page.width, styles.layout.headerHeight)
       .fill(styles.colors.background.header);
    
    // Add company name
    doc.fontSize(styles.typography.sizes.h1)
       .fillColor(styles.colors.text.white)
       .text('Ecotunga', styles.spacing.margin, 30);
    
    // Add report title
    doc.fontSize(styles.typography.sizes.h2)
       .fillColor(styles.colors.text.white)
       .text('Users Management Report', styles.spacing.margin, 70);
    
    // Add generation info
    doc.fontSize(styles.typography.sizes.small)
       .fillColor(styles.colors.text.light)
       .text(`Generated on: ${new Date().toLocaleString()}`, styles.spacing.margin, 120);
    
    // Add total users count
    doc.fontSize(styles.typography.sizes.body)
       .fillColor(styles.colors.secondary)
       .text(`Total Users: ${users.length}`, styles.spacing.margin, 150);
    
    // Calculate table dimensions
    const tableTop = 180;
    const tableLeft = styles.spacing.margin;
    const tableWidth = doc.page.width - (styles.spacing.margin * 2);
    const colWidth = tableWidth / 3;
    
    // Draw table header background
    doc.fillColor(styles.colors.background.table.header)
       .rect(tableLeft, tableTop, tableWidth, styles.spacing.rowHeight)
       .fill();
    
    // Add table header text
    doc.fontSize(styles.typography.sizes.body)
       .fillColor(styles.colors.text.primary)
       .text('Name', tableLeft + styles.spacing.padding, tableTop + styles.spacing.padding)
       .text('Email', tableLeft + colWidth + styles.spacing.padding, tableTop + styles.spacing.padding)
       .text('Joined Date', tableLeft + (colWidth * 2) + styles.spacing.padding, tableTop + styles.spacing.padding);
    
    // Add table rows
    let currentY = tableTop + styles.spacing.rowHeight;
    users.forEach((user, index) => {
      // Draw row background
      doc.fillColor(index % 2 === 0 ? 
        styles.colors.background.table.row.even : 
        styles.colors.background.table.row.odd)
         .rect(tableLeft, currentY, tableWidth, styles.spacing.rowHeight)
         .fill();
      
      // Add row content
      doc.fontSize(styles.typography.sizes.small)
         .fillColor(styles.colors.text.secondary)
         .text(user.name || 'N/A', tableLeft + styles.spacing.padding, currentY + styles.spacing.padding)
         .text(user.email, tableLeft + colWidth + styles.spacing.padding, currentY + styles.spacing.padding)
         .text(new Date(user.created_at).toLocaleDateString(), tableLeft + (colWidth * 2) + styles.spacing.padding, currentY + styles.spacing.padding);
      
      currentY += styles.spacing.rowHeight;
      
      // Add new page if needed
      if (currentY > doc.page.height - styles.layout.footerHeight - styles.spacing.margin) {
        doc.addPage();
        currentY = styles.spacing.margin;
      }
    });
    
    // Add footer on each page
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      
      // Add footer background
      doc.fillColor(styles.colors.background.footer)
         .rect(0, doc.page.height - styles.layout.footerHeight, doc.page.width, styles.layout.footerHeight)
         .fill();
      
      // Add footer text
      doc.fontSize(styles.typography.sizes.small)
         .fillColor(styles.colors.text.light)
         .text(
           `Page ${i + 1} of ${pageCount}`,
           styles.spacing.margin,
           doc.page.height - 25,
           { align: 'left' }
         )
         .text(
           '© 2024 Ecotunga. All rights reserved.',
           styles.spacing.margin,
           doc.page.height - 25,
           { align: 'right', width: doc.page.width - (styles.spacing.margin * 2) }
         );
    }
    
    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};

const getUsersCount = async (req, res) => {
  try {
    const count = await db('users').count('id as total').first();
    res.json({ count: parseInt(count.total) });
  } catch (error) {
    console.error('Error counting users:', error);
    res.status(500).json({ message: 'Error counting users' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    // Get user count
    const userCount = await db('users').count('id as total').first();
    
    // Get waste collection counts by status
    const wasteCollectionStats = await db('waste_collection')
      .select('status')
      .count('* as count')
      .groupBy('status');
    
    // Get total waste collections
    const totalWasteCollections = await db('waste_collection').count('id as total').first();
    
    // Get companies count
    const companiesCount = await db('companies').count('id as total').first();
    
    // Transform waste collection stats into a more usable format
    const wasteStats = {};
    wasteCollectionStats.forEach(stat => {
      wasteStats[stat.status] = parseInt(stat.count);
    });
    
    res.json({
      users: parseInt(userCount.total),
      totalWasteCollections: parseInt(totalWasteCollections.total),
      companies: parseInt(companiesCount.total),
      wasteCollectionsByStatus: wasteStats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  updateProfile,
  getProfile,
  generateUsersPDF,
  getUsersCount,
  getDashboardStats
}; 