const express = require('express');
const joi = require('joi');

const router = express.Router();

const contacts = require('../../models/contacts');

const addSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  phone: joi.string().required(),
});

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

    if (!data) return res.status(404).json({ message: 'Not found' });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);

    if (error) return res.status(400).json({ message: 'missing required name field' });

    const data = await contacts.addContact(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const data = await contacts.removeContact(req.params.contactId);

    if (!data) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);

    if (error) return res.status(400).json({ message: 'missing fields' });

    const data = await contacts.updateContact(req.params.contactId, req.body);

    if (!data) return res.status(404).json({ message: 'Not found' });

    res.status(200).json(data);
  } catch (error) {}
});

module.exports = router;
