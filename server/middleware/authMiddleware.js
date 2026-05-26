// ========================================
// Auth Middleware
// Purpose:
// Checks if a request has a valid JWT token
// before allowing access to protected routes
// ========================================

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // The frontend should send the token in the Authorization header.
  // Format: Authorization: Bearer tokenHere
  const authHeader = req.headers.authorization;

  // If no Authorization header exists, block access.
  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  // Split "Bearer tokenHere" into ["Bearer", "tokenHere"]
  const token = authHeader.split(" ")[1];

  // If the token is missing after Bearer, block access.
  if (!token) {
    return res.status(401).json({
      message: "Invalid token format",
    });
  }

  try {
    // Verify checks whether the token is real and not expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save decoded user info onto the request object.
    // This lets protected routes access req.user.
    req.user = decoded;

    // Move on to the protected route.
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;