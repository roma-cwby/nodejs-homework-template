const { User } = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const requestError = require('../helpers/RequestEroor');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const jimp = require('jimp');

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res, next) => {
  try {
    const hashPass = await bcrypt.hash(req.body.password, 10);
    const avatarURL = gravatar.url(req.body.email);

    const newUser = await User.create({ ...req.body, password: hashPass, avatarURL });

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
  try {
    const { email, subscription } = req.user;
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};

const subscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;
    await User.findByIdAndUpdate(_id, { subscription });
    res.status(200).json(req.body);
  } catch (error) {
    next(error);
  }
};

const avatars = async (req, res, next) => {
  try {
    const { path: tempUpload, originalname } = req.file;

    const fileName = `${req.user._id}_${originalname}`;

    const resultUpload = path.join(avatarsDir, fileName);
    await fs.rename(tempUpload, resultUpload);

    const img = await jimp.read(resultUpload);
    img.resize(250, 250).write(resultUpload);

    const avatarURL = path.join('avatars', fileName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL });

    res.status(200).json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, current, logout, subscription, avatars };
