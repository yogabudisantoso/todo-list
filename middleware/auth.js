const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function auth(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.header('Authorization');
  
  // Check if no auth header
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  // Check if it's a Bearer token
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid token format, use Bearer token' });
  }
  
  // Extract the token
  const token = authHeader.split(' ')[1];
  
  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = auth;