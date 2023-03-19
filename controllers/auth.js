const { User } = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const requestError = require('../helpers/RequestEroor');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const jimp = require('jimp');
const { v4: uuid } = require('uuid');
const sendEmail = require('../helpers/sendEmail');

const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res, next) => {
  try {
    const hashPass = await bcrypt.hash(req.body.password, 10);
    const avatarURL = gravatar.url(req.body.email);
    const verificationToken = uuid();

    const newUser = await User.create({
      ...req.body,
      password: hashPass,
      avatarURL,
      verificationToken,
    });

    const vereifyEmail = {
      to: req.body.email,
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Verify email</a>`,
    };

    await sendEmail(vereifyEmail);

    res.status(201).json({ name: newUser.name, email: newUser.email });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });
    if (!user) throw requestError(404, 'User not found');

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' });

    res.status(200).json({
      message: 'Verification successful',
    });
  } catch (error) {
    next(error);
  }
};

const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = User.findOne({ email });

    if (!user) throw requestError(404, 'Email not found');

    if (user.verify) throw requestError(400, 'Verification has already been passed');

    const vereifyEmail = {
      to: email,
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Verify email</a>`,
    };

    await sendEmail(vereifyEmail);

    res.status(200).json({
      message: 'Verification email send',
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw requestError(401, 'Email or password invalid');
    if (!user.verify) throw requestError(401, 'Email not verify');

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

module.exports = {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  current,
  logout,
  subscription,
  avatars,
};
