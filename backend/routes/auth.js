const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

// Sign-up Route:
router.post('/signup', userController.createUser);

// Get users
router.get('/reporters', userController.getAllUsers);
router.get('/reporters/:id', userController.getUserById);
router.get('/current-user', authMiddleware, userController.getCurrentUser);
// router.get('/admin/dashboard', authMiddleware, adminMiddleware, );

// Login Route
router.post('/login', userController.findUserByEmail);


module.exports = router;
