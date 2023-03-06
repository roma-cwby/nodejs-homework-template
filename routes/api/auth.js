const express = require('express');
const validateBody = require('../../helpers/schemaValidate');
const authenticate = require('../../middlewares/authenticate');
const { registerSchema, loginSchema, subscriptionSchema } = require('../../models/users');

const ctrl = require('../../controllers/auth');

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrl.register);

router.get('/login', validateBody(loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.current);

router.post('/logout', authenticate, ctrl.logout);

router.patch('/', authenticate, validateBody(subscriptionSchema), ctrl.subscription);

module.exports = router;
