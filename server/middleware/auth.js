const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("Authorization");

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    // Token may be prefixed with "Bearer "
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    
    // Check if the JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // Set user object from decoded payload
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
