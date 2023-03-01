const express = require('express');

const router = express.Router();

const contacts = require('../../models/contacts');

const validate = require('../../helpers/schemaValidate');
const requestError = require('../../helpers/RequestEroor');

router.get('/', async (req, res, next) => {
  try {
    const data = await contacts.listContacts();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const data = await contacts.getContactById(req.params.contactId);

    if (!data) throw requestError(404, 'Not found');

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (!validate(req.body)) throw requestError(400, 'missing required name field');

    const data = await contacts.addContact(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const data = await contacts.removeContact(req.params.contactId);

    if (!data) throw requestError(404, 'Not found');
    res.status(200).json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    if (!validate(req.body)) throw requestError(400, 'Missing fields');

    const data = await contacts.updateContact(req.params.contactId, req.body);

    if (!data) throw requestError(404, 'Not found');

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
