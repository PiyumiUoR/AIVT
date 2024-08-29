const jwt = require('jsonwebtoken');
const { fetchUserById } = require("../controllers/userController");

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const adminId = decoded.id;

    const userData = await fetchUserById(adminId);
    console.log('Fetched user data:', userData);

    if (!userData || userData.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    // Attach adminId to req for further processing
    req.user = { id: adminId, role: userData.role };

    next();
  } catch (error) {
    console.error("Error in adminMiddleware:", error);
    res.status(500).json({ message: "Server error while verifying admin privileges." });
  }
};

module.exports = adminMiddleware;
