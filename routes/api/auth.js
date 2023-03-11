const express = require('express');
const validateBody = require('../../helpers/schemaValidate');
const authenticate = require('../../middlewares/authenticate');
const { registerSchema, loginSchema, subscriptionSchema } = require('../../models/users');
const upload = require('../../middlewares/upload');

const ctrl = require('../../controllers/auth');
const { required } = require('joi');

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrl.register);

router.get('/login', validateBody(loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.current);

router.post('/logout', authenticate, ctrl.logout);

router.patch('/', authenticate, validateBody(subscriptionSchema), ctrl.subscription);

router.patch('/avatars', authenticate, upload.single('avatar'), ctrl.avatars);

module.exports = router;
