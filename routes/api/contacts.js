const express = require('express');
const isValidId = require('../../middlewares/isValidId');
const ctrl = require('../../controllers/contacts');
const validateBody = require('../../helpers/schemaValidate');
const authenticate = require('../../middlewares/authenticate');
const { addSchema, updateFavoriteSchema } = require('../../models/contact');

const router = express.Router();

router.get('/', authenticate, ctrl.getAll);

router.get('/:contactId', authenticate, isValidId, ctrl.getById);

router.post('/', authenticate, validateBody(addSchema), ctrl.add);

router.put('/:contactId', authenticate, isValidId, validateBody(addSchema), ctrl.update);

router.patch(
  '/:contactId/favorite',
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrl.updateFavorite
);

router.delete('/:contactId', authenticate, isValidId, ctrl.del);

module.exports = router;
