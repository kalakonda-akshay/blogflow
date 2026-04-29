const jwt  = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const safe = (u) => ({ _id: u._id, name: u.name, email: u.email, bio: u.bio, avatar: u.avatar, createdAt: u.createdAt });

exports.register = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ message: errs.array()[0].msg });
    const { name, email, password, bio } = req.body;
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, bio });
    res.status(201).json({ token: makeToken(user._id), user: safe(user) });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ message: errs.array()[0].msg });
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: makeToken(user._id), user: safe(user) });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res) => res.json({ user: safe(req.user) });

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(bio !== undefined && { bio }), ...(avatar && { avatar }) },
      { new: true, runValidators: true }
    );
    res.json({ user: safe(user) });
  } catch (err) { next(err); }
};
