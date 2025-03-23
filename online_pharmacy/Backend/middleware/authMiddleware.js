const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  try {
    const actualToken = token.split(' ')[1]; // Extract only the token part
    const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = verified;

    console.log("Verified User ID:", req.user.id); // Debugging user ID

    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = authMiddleware;
