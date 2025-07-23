const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const validRoles = ['user', 'waste_collector', 'recycling_center', 'admin'];
  let userRole = role;
  if (!validRoles.includes(userRole)) {
    console.error('Invalid role received:', userRole);
    return res.status(400).json({ message: 'Invalid role specified.' });
  }
  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const insertData = {
      id,
      name,
      email,
      password: hashedPassword,
      role: userRole
    };
    const insertResult = await db('users').insert(insertData);
    const insertedUser = await db('users').where('id', id).first();
    if (userRole === 'waste_collector' || userRole === 'recycling_center') {
      try {
        const [dbNameRow] = await db.raw('SELECT DATABASE() as dbname');
        const dbName = dbNameRow[0]?.dbname || dbNameRow[0] || 'unknown';
      } catch (dbError) {
      }
      
      const companyData = {
        name: name,
        email: email,
        phone: '000000000', // dummy phone
        logo: '',
        district: 'Unknown',
        sector: 'Unknown',
        cell: 'Unknown',
        village: 'Unknown',
        street: 'Unknown',
        amount_per_month: 0,
        type: userRole
      };
      try {
        const [companyId] = await db('companies').insert(companyData);
        const createdCompany = await db('companies').where({ id: companyId }).first();
        const allCompanies = await db('companies').select('*');
      } catch (companyError) {
        console.error('Error creating company record:', companyError);
      }
    } else {
    }
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await db('users').where({ id: req.user.id }).select('id', 'name', 'email', 'role').first();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.logout = (req, res) => {
  // Simply tell the client to remove the token
  res.status(200).json({
    message: "Logout successful. Please remove token from client.",
  });
};

