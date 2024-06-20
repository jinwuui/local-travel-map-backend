// middleware/auth.js
function extractUserId(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const userId = authorizationHeader.split(" ")[1]; // Bearer <userId>
    if (userId) {
      req.userId = userId;
    } else {
      return res
        .status(400)
        .json({ message: "Invalid authorization header format" });
    }
  }

  next();
}

module.exports = extractUserId;
