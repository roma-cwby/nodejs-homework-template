const express = require('express');
const router = express.Router();
const { Contact } = require('../../models/contact');
const isValidId = require('../../middlewares/isValidId');

const validate = require('../../helpers/schemaValidate');
const requestError = require('../../helpers/RequestEroor');

router.get('/', async (req, res, next) => {
  try {
    const data = await Contact.find();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', isValidId, async (req, res, next) => {
  try {
    const data = await Contact.findById(req.params.contactId);

    if (!data) throw requestError(404, 'Not found');

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (!validate(req.body)) throw requestError(400, 'missing required name field');

    const data = await Contact.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', isValidId, async (req, res, next) => {
  try {
    if (!validate(req.body)) throw requestError(400, 'Missing fields');

    const data = await Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true });

    if (!data) throw requestError(404, 'Not found');

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.patch('/:contactId/favorite', isValidId, async (req, res, next) => {
  try {
    if (!validate(req.body, 'favorite')) throw requestError(400, 'Missing field favorite');

    const data = await Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true });

    if (!data) throw requestError(404, 'Not found');

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', isValidId, async (req, res, next) => {
  try {
    const data = await Contact.findByIdAndRemove(req.params.contactId);

    if (!data) throw requestError(404, 'Not found');
    res.status(200).json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
