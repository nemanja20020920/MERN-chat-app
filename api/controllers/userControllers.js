const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { createToken } = require('../utils/tokenUtils');

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, pic } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error('Please fill all the fields!');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists!');
  }

  const newUser = await User.create({
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email,
    password,
    pic,
  });

  if (newUser) {
    res.status(200).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      pic: newUser.pic,
      token: createToken(newUser._id, '30d'),
    });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please fill all the fields!');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error('User does not exist!');
  }

  if (await user.matchPassword(password)) {
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      pic: user.pic,
      isAdmin: user.isAdmin,
      token: createToken(user._id, '30d'),
    });
  } else {
    res.status(400);
    throw new Error('Wrong password!');
  }
});

module.exports = { registerUser, loginUser };
