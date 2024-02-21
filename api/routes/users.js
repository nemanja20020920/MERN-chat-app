const express = require('express');
const {
  registerUser,
  loginUser,
  fetchUsers,
} = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, fetchUsers);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

module.exports = router;
