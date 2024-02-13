const jwt = require('jsonwebtoken');

const createToken = (id, expiresIn) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn });
};

module.exports = { createToken };
