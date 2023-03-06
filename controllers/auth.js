const { User } = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const requestError = require('../helpers/RequestEroor');

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  try {
    const hashPass = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({ ...req.body, password: hashPass });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) throw requestError(401, 'Email or password invalid');

    const passCompare = await bcrypt.compare(req.body.password, user.password);

    if (!passCompare) throw requestError(401, 'Email or password invalid');

    const payload = { id: user._id };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).json({});
};

const subscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription });
  res.status(200).json(req.body);
};

module.exports = { register, login, current, logout, subscription };
