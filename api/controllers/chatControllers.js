const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error('UserId param not sent with request!');
  }

  let isChat = await Chat.findOne({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'fullName pic email',
  });

  if (isChat) {
    res.send(isChat);
  } else {
    try {
      const newChat = await Chat.create({
        users: [req.user._id, userId],
      });

      const fullChat = await Chat.findOne({ _id: newChat._id }).populate(
        'users',
        '-password'
      );

      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: userId } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: 'fullName pic email',
    });

    res.status(200).send(chats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { name, users } = req.body;

  if (!name || !users || users.length < 2) {
    res.status(400);
    throw new Error('Fill all the fields!');
  }

  users.push(req.user._id);

  try {
    let newGroup = await Chat.create({
      name,
      users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    newGroup = await User.populate(newGroup, 'users groupAdmin', '-password');

    res.status(200).send(newGroup);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { groupId, name } = req.body;

  if (!groupId || !name) {
    res.status(400);
    throw new Error('Fill all the fields!');
  }

  try {
    const newGroupChat = await Chat.findByIdAndUpdate(
      groupId,
      {
        name,
      },
      { new: true }
    )
      .populate('latestMessage')
      .populate('users latestMessage.sender', '-password');

    res.status(200).send(newGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const addUserToGroup = asyncHandler(async (req, res) => {
  const { userId, groupId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error('UserId param not provided!');
  }

  if (!groupId) {
    res.status(400);
    throw new Error('GroupId param not provided!');
  }

  try {
    let newGroup = await Chat.find({
      _id: groupId,
      groupAdmin: req.user._id,
    });

    if (!newGroup) {
      res.status(400);
      throw new Error('Not allowed!');
    }

    newGroup = await Chat.findByIdAndUpdate(
      groupId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate('users groupAdmin', '-password')
      .populate('latestMessage')
      .populate('latestMessage.sender', 'fullName pic email');

    res.status(200).send(newGroup);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const removeUserFromGroup = asyncHandler(async (req, res) => {
  const { userId, groupId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error('UserId param not provided!');
  }

  if (!groupId) {
    res.status(400);
    throw new Error('GroupId param not provided!');
  }

  try {
    let newGroup = await Chat.find({
      _id: groupId,
      groupAdmin: req.user._id,
    });

    if (!newGroup) {
      res.status(400);
      throw new Error('Not allowed!');
    }

    newGroup = await Chat.findByIdAndUpdate(
      groupId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate('users groupAdmin', '-password')
      .populate('latestMessage')
      .populate('latestMessage.sender', 'fullName pic email');

    res.status(200).send(newGroup);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
};
