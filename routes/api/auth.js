const express = require('express');
const validateBody = require('../../helpers/schemaValidate');
const authenticate = require('../../middlewares/authenticate');
const {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  verifyEmailSchema,
} = require('../../models/users');
const upload = require('../../middlewares/upload');

const ctrl = require('../../controllers/auth');

const router = express.Router();

//register

router.post('/register', validateBody(registerSchema), ctrl.register);

router.get('/verify/:verificationToken', ctrl.verifyEmail);

router.post('/verify', validateBody(verifyEmailSchema), ctrl.resendVerifyEmail);

//login

router.get('/login', validateBody(loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.current);

router.post('/logout', authenticate, ctrl.logout);

router.patch('/', authenticate, validateBody(subscriptionSchema), ctrl.subscription);

router.patch('/avatars', authenticate, upload.single('avatar'), ctrl.avatars);

module.exports = router;
