const express = require('express');
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
} = require('../controllers/chatControllers');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/fetchChats').get(protect, fetchChats);
router.route('/createGroup').post(protect, createGroupChat);
router.route('/renameGroup').put(protect, renameGroup);
router.route('/addToGroup').put(protect, addUserToGroup);
router.route('/removeFromGroup').put(protect, removeUserFromGroup);
// router.route('/deleteGroup/:chatId').delete(protect, deleteChat);

module.exports = router;
