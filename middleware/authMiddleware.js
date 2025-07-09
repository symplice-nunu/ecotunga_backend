const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Expecting format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch the full user from the database
    const user = await db('users').where({ id: decoded.id }).first();
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user; // Attach full user object (id, email, role, etc)
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
