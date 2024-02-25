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

const fetchUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;

  try {
    const dbQuery = search
      ? {
          _id: { $ne: req.user._id },
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {
          _id: { $ne: req.user._id },
        };

    const users = await User.find(dbQuery, { password: 0 }).sort({
      fullName: 'asc',
    });

    res.status(200).send(users);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = { registerUser, loginUser, fetchUsers };
