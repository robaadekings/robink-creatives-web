const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.register = async (data) => {
    const exists = await User.findOne({ email: data.email });
    if (exists) {
        throw new ApiError('Email already in use', 400);

        const hash = await bcrypt.hash(data.password, 10);
        const user = await User.create({ ...data, password: hash });
        return { token: generateToken(user) };
    };
};

exports.login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError('Invalid email or password', 400);
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new ApiError('Invalid email or password', 400);
        }
        return { token: generateToken(user) };
    };
};