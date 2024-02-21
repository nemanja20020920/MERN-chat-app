const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

const fetchMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    res.status(400);
    throw new Error('ChatId param not present!');
  }

  try {
    const chat = await Chat.findOne({ _id: chatId });

    if (!chat) {
      res.status(400);
      throw new Error('Chat does not exist!');
    }

    const messages = await Message.find({ chat: chatId }).populate(
      'sender',
      'fullName pic'
    );

    res.status(200).send(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!chatId) {
    res.status(400);
    throw new Error('ChatId param missing!');
  }

  if (!content) {
    res.status(400);
    throw new Error('Content missing!');
  }

  try {
    const chat = await Chat.findOne({ _id: chatId });

    if (!chat) {
      res.status(400);
      throw new Error('Chat does not exist!');
    }

    let newMessage = await Message.create({
      content,
      chat: chatId,
      sender: req.user._id,
    });

    newMessage = await User.populate(newMessage, {
      path: 'sender',
      select: 'fullName pic',
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: newMessage._id,
    });

    res.status(200).send(newMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { fetchMessages, sendMessage };
